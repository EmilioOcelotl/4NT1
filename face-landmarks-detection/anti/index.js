//////////////////////////////////
/////////// 4NT1 /////////////////
//////////////////////////////////

import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection'
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl'; 
import '@tensorflow/tfjs-backend-cpu';
import * as THREE from 'three';
import {TRIANGULATION} from './js/triangulation'; 
import * as Tone from 'tone';
import Stats from 'stats.js';
// import {Reflector} from '/Reflector.js'; // lo movi a js
import { EffectComposer } from './jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from '/jsm/postprocessing/UnrealBloomPass.js';
import { GlitchPass } from '/jsm/postprocessing/GlitchPass.js';
//import { SVGLoader } from '/jsm/loaders/SVGLoader.js';
import { TTFLoader } from '/jsm/loaders/TTFLoader.js';

// const OSC = require('osc-js'); // pal osc 
// const osc = new OSC(); 
// const osc = new OSC({ plugin: new OSC.WebsocketServerPlugin() })

let luces = []; 
let clight1, clight2, clight3, clight4; 

let scene, camera, renderer, material, cube, geometryPoints; 
let geometryC, materialC; 
let cubos = [];
let cuboGrande = new THREE.Mesh(); 
let grupo; 
let font; 
let text = new THREE.Mesh(); 
let torus = []; 
let matArray = []; 
let prueba = 0; 
let afft = [];
const analyser = new Tone.Analyser( "fft", 64 ) ;
let postB = true; 

const pGeometry = new THREE.PlaneGeometry(8, 8, 21, 20);
const position = pGeometry.attributes.position;
position.usage = THREE.DynamicDrawUsage;
// let position = []; 
// const pGeometry = new THREE.BufferGeometry();

let geometryB; 

let  vertices = []; 

const panner  = new Tone.Panner3D({
	panningModel: "HRTF",
    }).toDestination(); 

const NUM_KEYPOINTS = 468; 

let points = [];
let normals = [];
let keypoints = [];  

let laterales = []; 

let geometry = new THREE.BufferGeometry();
let mesh =  new THREE.Mesh();
let meshB = new THREE.Mesh() ; 
let degree;
let xMid; 

let model, ctx, videoWidth, videoHeight, video;

const VIDEO_SIZE = 800;

const loaderHTML = document.getElementById("loaderHTML");
const startButton = document.getElementById( 'startButton' );
const myProgress = document.getElementById( "myProgress" );
const myBar = document.getElementById( "myBar" );

startButton.addEventListener( 'click', init  );

let colores = [], colores2 = []; 
const stats = new Stats();

let predictions = []; 
let container; 
let planeB;

let composer;
let planeVideo;
let planeBuscando; 
let materialVideo;

let escena = 0;

let rendereo; 
let buscando = false;
let numsc = 3; 
let ofTexture;
    
let wet = [0.1, 0.2, 0, 0.04];let wetActual;
let reverse = [true, false, false, true, false];let reverseActual;let reverseCambio = 0; 
let pitch = [0, -12, 0, -12, 12, 7, -7];let pitchActual;let pitchCambio = 0; 
let start = [0.1, 0.5 ,0.7, 0.3, 0.9, 1.5, 2.0];let startActual;let startCambio = 0; 
let cambioC = 0;

let pitchShift, reverb, dist;
let player, antiKick;

let seq1, seq2, seq3; 

let flow, curve, curveHandles = []; 

let textMesh1; 
///////////// Retro

const dpr = window.devicePixelRatio;
const textureSize = 1024 * dpr;
let texture; 
const vector = new THREE.Vector2();
// let cuboGrande; 

///////////// Setupear la cámara

async function setupCamera() {
    video = document.getElementById('video');
    const stream = await navigator.mediaDevices.getUserMedia({
	'audio': false,
	'video': {
	    facingMode: 'user',  
	    width : 400,
	    height: 400},
    });
    video.srcObject = stream;
    return new Promise((resolve) => {
	video.onloadedmetadata = () => {
	    resolve(video);
	};
    });
}

////////////// Lectra de keypoints, detonación de escenas  

async function renderPrediction() {

    var time2 = Date.now() * 0.01;
    
    predictions = await model.estimateFaces({
	input: video,
	returnTensors: false,
	flipHorizontal: false,
	predictIrises: false
    });

    if (prueba != predictions.length){
	initsc0();
    }
    
    prueba = predictions.length;
    materialVideo.needsUpdate = true;
    
    let vueltas = 0;
    
    if (predictions.length > 0) {
	predictions.forEach(prediction => {
	    keypoints = prediction.scaledMesh; 

	    for (let i = 0; i < TRIANGULATION.length / 3; i++) {
		points = [
		    TRIANGULATION[i * 3], TRIANGULATION[i * 3 + 1],
		    TRIANGULATION[i * 3 + 2]
		].map(index => keypoints[index]);
	    }
	    
	});
    }

    /////////////////// rotación en z de la cara
    
    if (predictions.length > 0) {
	const { annotations } = predictions[0]; // solo agarra una prediccion 
	const [topX, topY] = annotations['midwayBetweenEyes'][0];
	const [rightX, rightY] = annotations['rightCheek'][0];
	const [leftX, leftY] = annotations['leftCheek'][0];
	const bottomX = (rightX + leftX) / 2;
	const bottomY = (rightY + leftY) / 2;
	degree = Math.atan((topY - bottomY) / (topX - bottomX));
    }

    requestAnimationFrame(renderPrediction);
    
};

///////////////////////// Inicialización

async function init() {
    
    const overlay = document.getElementById( 'overlay' );
    overlay.remove();

    const info = document.getElementById( 'info' );
    info.remove();

    loaderHTML.style.display = "block";
   
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    await tf.setBackend('webgl'); 
    await setupCamera();
    video.play();
    
    videoWidth = video.videoWidth;
    videoHeight = video.videoHeight;
    video.width = videoWidth;
    video.height = videoHeight;

    model = await faceLandmarksDetection.load(
	faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
	{maxFaces: 2});
    
    scene = new THREE.Scene();
    // scene.background = new THREE.Color( 0x000000 ); // UPDATED
    
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    
    camera.position.z = 40;
    camera.rotation.z = Math.PI; 

    cols(); 
    
    for(let i = 0; i < 4; i++){
	luces[i] = new THREE.PointLight(colores[i], 0.5);
	scene.add( luces[i] ); 
    }
    
    const geometryVideo = new THREE.PlaneGeometry( 50, 50 );
    materialVideo = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
    planeVideo = new THREE.Mesh( geometryVideo, materialVideo );
    planeVideo.rotation.x = Math.PI;
    planeVideo.position.z = -10;
    scene.add( planeVideo );

    retro(); 
    
    materiales();
    
    /* 
    for(var i = 0; i < 6; i++){
	const al = Math.random() * 10 + 32; 
	// const geometry = new THREE.CylinderGeometry( al, al, 0.5, 128, true, 0 );
	const geometry = new THREE.TorusGeometry( al, 0.2, 16, 150 );
	torus[i] = new THREE.Mesh( geometry, matArray[i%3] );
	scene.add( torus[i] );
	torus[i].position.z = -10;
	torus[i].rotation.x = Math.PI * Math.random(); 
	// torus[i].position.x = Math.random() * 4 + 10; 
    }
   */

    planeB = new THREE.Mesh(pGeometry, materialC);
    pGeometry.verticesNeedUpdate = true; 
    
    const gCube = new THREE.TorusKnotGeometry( 5, 1, 100, 16 );
    cube = new THREE.Mesh( gCube, materialC );

    geometryB = new THREE.BufferGeometry();
    geometryB.verticesNeedUpdate = true; 

    cuboGrandeGeometry = new THREE.BoxGeometry( 200, 200, 200 );
    //cuboGrandeGeometry = new THREE.IcosahedronGeometry( 200, 1 );
    
    // cuboGrandeGeometry = new THREE.SphereGeometry( 200, 32, 32 );
    cuboGrande = new THREE.Mesh(cuboGrandeGeometry, materialC2 );

    /*
    geometryMirr = new THREE.PlaneGeometry( 80, 80 );

    groundMirror = new Reflector( gCube, {
	// clipBias: 0.003,
	textureWidth: window.innerWidth * window.devicePixelRatio,
	textureHeight: window.innerHeight * window.devicePixelRatio,
	color: 0x889999
    } );

    // groundMirror.position.y = 10;
    groundMirror.position.z = -20;
    groundMirror.position.x = 30; 
    groundMirror.rotateY( - Math.PI / 4 );
    scene.add( groundMirror );

    */ 
    				          
    texto();
    
    renderer = new THREE.WebGLRenderer({antialias: true});

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    // renderer.autoClear = false;
    // renderer.toneMapping = THREE.ReinhardToneMapping;
    document.body.appendChild( renderer.domElement );
    // renderer.setClearColor( 0x101000 );
    
    window.addEventListener( 'resize', onWindowResize );

    container.appendChild( stats.dom ); 

    const renderScene = new RenderPass( scene, camera );
	
    const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    bloomPass.threshold = 0.21;
    bloomPass.strength = 1.25;
    bloomPass.radius = 0.55;
    // bloomPass.renderToScreen = true;
    
    composer = new EffectComposer( renderer );
    composer.addPass( renderScene );

    // composer.addPass( bloomPass );
   
    glitchPass = new GlitchPass();
    composer.addPass( glitchPass ); 

    detonar(); 
    
}

async function animate () {

    requestAnimationFrame( animate );
        
    var time2 = Date.now() * 0.0005;

    // animsc2();
    
    for(var i = 0; i < 4; i++){	
	luces[i].position.x = Math.sin( time2 * 0.3 + (0.5 * i)) * 2400;
	luces[i].position.y = Math.cos( time2 * 0.4 + (0.5*i)) * 2500-800;
	luces[i].position.z = Math.sin( time2 * 0.2 + (0.5 * i)) * 2400-200 + 4000;
    }
    
    text.position.x = keypoints[0][0]* 0.1 -10;
    text.position.y = keypoints[0][1]* 0.1 -35;
    text.position.z = keypoints[0][2] * 0.1 + 10;

    cube.position.x = keypoints[0][0]* 0.1- 30;
    cube.position.y = keypoints[0][1]* 0.1 -10;
    cube.position.z = keypoints[0][2] * 0.1 + 10;
    cube.rotation.x += 0.04;
    cube.rotation.y += 0.023;

    cuboGrande.rotation.x += 0.001;
    cuboGrande.rotation.y += 0.002; 
    text.rotation.y = degree * 2 + (Math.PI )   ;

   /*
    for(var i = 0; i < 6; i++){
	torus[i].rotation.y += 0.001 + (i * 0.0005); 
	torus[i].rotation.x += ( degree ) * (i+1) * 0.0015; 
	torus[i].rotation.z += 0.001 + (i * 0.0006);
    }
   */
 
    stats.update(); 
    
    renderer.render( scene, camera );

    panner.positionX.value = degree  ; 

    vertices = [];
    
    composer.render();

    vector.x = ( window.innerWidth * dpr / 2 ) - ( textureSize / 2 );
    vector.y = ( window.innerHeight * dpr / 2 ) - ( textureSize / 2 );
    
    renderer.copyFramebufferToTexture( vector, texture );
    
    if(buscando){
	switch( escena % numsc ){
	case 0:
	    animsc1(); 
	    break;
	case 1:
	    animsc2(); 
	    break;
	case 2:
	    animsc3();
	    break; 
	}	
    }
    
}

function initsc0(){
   
    if ( predictions.length < 1 ) {

	materialVideo.map = new THREE.TextureLoader().load( 'buscando.74525b9b.png' );
	materialVideo.map.wrapS = THREE.RepeatWrapping;
	materialVideo.map.repeat.x = - 1;
	materialVideo.map.rotation.y = Math.PI / 2;
 
	// switch de eliminación 

	switch(escena%numsc){
	case 0:
	    rmsc1();
	    break;
	case 1:
	    rmsc2();
	    break;
	case 3:
	    rmsc3();
	    break; 
	}

	buscando = false;
	myProgress.style.display = "none";
	
	scene.remove( cuboGrande );
	scene.remove( cube );
	scene.remove( text );
	// player.stop(); 
	Tone.Destination.mute = true;

	//clearInterval(seq1Interval);
	//clearInterval(seq2Interval);
	//clearInterval(seq3Interval); 
	
    } else {

	materialVideo.map = new THREE.VideoTexture( video );

	// switch de incialización
	
	switch(escena%numsc){
	case 0:
	    initsc1();
	    break;
	case 1:
	    initsc2(); 
	    break;
	case 2:
	    initsc3();
	    break; 
	}

	// cuboGrande.layers.enable(0); 
	scene.add( cuboGrande );
	scene.add( cube );
	
	// text.layers.enable(0);
	scene.add( text );
	
	buscando = true; 
	myProgress.style.display = "block";

	Tone.Destination.mute = false;

	//seq1 = setInterval(seq1Interval, 850); 
	//seq2 = setInterval(seq2Interval, 850);
	//seq3 = setInterval(seq3Interval, 850);
    	
    }
}

//////// objetos asociados a keypoints

function initsc1(){

    for(let i = 0; i < 4; i++){
	//luces[i] = new THREE.PointLight(colores[i], 0.5);
	scene.remove( luces[i] );
	luces[i].dispose(); 
    }
   
    for(let i = 0; i < 4; i++){
	luces[i] = new THREE.PointLight(colores[i], 0.5);
	scene.add( luces[i] );
	// luces[i].dispose(); 
    }
    
    let vueltas = 0; 
    
    for(let i = 0; i < cubos.length; i++){

	cubos[i].material.dispose();
	cubos[i].geometry.dispose(); 
	scene.remove( cubos[i] );
	
    }
    
    const geometryC = new THREE.SphereGeometry( 0.5, 2, 2 );
    
    if (predictions.length > 0) {
	predictions.forEach(prediction => {	    
	    for(let i = 0; i < NUM_KEYPOINTS; i++){		

		const al = Math.random() * 4 + 1; 
		cubos[vueltas] = new THREE.Mesh(geometryC, materialC);
		cubos[vueltas].rotation.x = Math.random() * Math.PI ;
		cubos[vueltas].rotation.y = Math.random() * Math.PI ; 
		cubos[vueltas].rotation.z = Math.random() * Math.PI ;
		cubos[vueltas].scale.x = 1+(Math.random() * 1);
		cubos[vueltas].scale.y = 1+(Math.random() * 1); 
		cubos[vueltas].scale.z = 1+(Math.random() * 4); 
		scene.add( cubos[vueltas] );
		vueltas++;
		
	    }
	})
    } 

}

function animsc1(){

    let vueltas = 0;
    
    for(let i = 0; i < NUM_KEYPOINTS; i++){
	
	const analisis = Tone.dbToGain ( analyser.getValue()[i%64] ) * 800;
	//const analisis = THREE.MathUtils.damp(Tone.dbToGain( analyser.getValue()[i%64] )* 200, 10000, 0.0001, 0.001) * 4  ;
	// const analisis = Tone.dbToGain ( analyser.getValue()[i%64] ) * 700; 
	cubos[vueltas].position.x = keypoints[i][0] * 0.1 - 20 ; 
	cubos[vueltas].position.y = keypoints[i][1] * 0.1 - 20 ; 
	cubos[vueltas].position.z = keypoints[i][2] * 0.05  * (1+analisis) ;
	cubos[vueltas].rotation.z += 0.02;
	cubos[vueltas].rotation.y += 0.0111;
	vueltas++;
	
      }
    
}

function rmsc1(){

    for(let i = 0; i < 4; i++){
	//luces[i] = new THREE.PointLight(colores[i], 0.5);
	scene.remove( luces[i] );
	luces[i].dispose(); 
    }
  
    for(let i = 0; i < cubos.length; i++){

 	cubos[i].material.dispose();
	cubos[i].geometry.dispose(); 
	scene.remove( cubos[i] );
	
    }
    
}

//////// Mesh desordenado 

function initsc2(){

    planeB.material = materialC;  
        
    for(let i = 0; i < 4; i++){
	//luces[i] = new THREE.PointLight(colores[i], 0.5);
	scene.remove( luces[i] );
	luces[i].dispose(); 
    }
    
    for(let i = 0; i < 4; i++){
	luces[i] = new THREE.PointLight(colores2[i], 0.5);
	scene.add( luces[i] );
	// luces[i].dispose(); 
    }
    
    scene.add( planeB );
  
}

function animsc2(){
    
    for ( let i = 0; i < position.count; i ++ ) {	
	const analisis = Tone.dbToGain ( analyser.getValue()[i%64] ) * 20;
	// const analisis = 0; // para desactivar la audio reactividad 
	position.setX( i, (keypoints[i][0] * 0.1 - 20) * (1+analisis) );
	position.setY( i, (keypoints[i][1] * 0.1 - 20) * (1+analisis) );
	position.setZ( i, keypoints[i][2] * 0.05  * (1+ analisis) ); 
    }
    
    planeB.geometry.computeVertexNormals(); 
    planeB.geometry.attributes.position.needsUpdate = true;
    
    position.needsUpdate = true;
    
}

function rmsc2(){

    for(let i = 0; i < 4; i++){
	//luces[i] = new THREE.PointLight(colores[i], 0.5);
	scene.remove( luces[i] );
	luces[i].dispose(); 
    }
  
    // planeB.material.dispose();
    // planeB.geometry.dispose(); 
    scene.remove( planeB );
    
}

function initsc3(){

    planeB.material = matofTexture;  
    
    for(let i = 0; i < 4; i++){
	//luces[i] = new THREE.PointLight(colores[i], 0.5);
	scene.remove( luces[i] );
	luces[i].dispose(); 
    }
    
    for(let i = 0; i < 4; i++){
	luces[i] = new THREE.PointLight(colores3[i], 0.5);
	scene.add( luces[i] );
	// luces[i].dispose(); 
    }

    // planeB.material.map.dispose();     
    
    scene.add( planeB );

}

function animsc3(){

    for ( let i = 0; i < position.count; i ++ ) {	
	const analisis = Tone.dbToGain ( analyser.getValue()[i%64] ) * 20;
	// const analisis = 0; // para desactivar la audio reactividad 
	position.setX( i, (keypoints[i][0] * 0.1 - 20) * (1+analisis) );
	position.setY( i, (keypoints[i][1] * 0.1 - 20) * (1+analisis) );
	position.setZ( i, keypoints[i][2] * 0.05  * (1+ analisis) ); 
    }
    
    planeB.geometry.computeVertexNormals(); 
    planeB.geometry.attributes.position.needsUpdate = true;
    
    position.needsUpdate = true;

}

function rmsc3(){
    
      for(let i = 0; i < 4; i++){
	//luces[i] = new THREE.PointLight(colores[i], 0.5);
	scene.remove( luces[i] );
	luces[i].dispose(); 
    }
  
    // planeB.material.dispose();
    // planeB.geometry.dispose(); 
    scene.remove( planeB );
    
}

function cols(){
    
    colores = [new THREE.Color( 0x1afe49 ),
	       new THREE.Color( 0x8386f5 ),
	       new THREE.Color( 0x3d43b4 ),
	       new THREE.Color( 0x04134b ),
	       new THREE.Color( 0x000000 ) ];

    colores2 = [new THREE.Color( 0x00003b ),
		new THREE.Color( 0x33003b ),
		new THREE.Color( 0x66003b ),
		new THREE.Color( 0x99003b ),
		new THREE.Color( 0x000000 ) ];

    colores3 = [new THREE.Color( 0xffffff ),
		new THREE.Color( 0xffffff ),
		new THREE.Color( 0xffffff ),
		new THREE.Color( 0xffffff ),
		new THREE.Color( 0xffffff ) ];
    
}

function materiales(){

    for(var i = 0; i < 4; i++){
	matArray[i] =  new THREE.MeshPhongMaterial( { color: 0x000000, specular: colores[i%2], emissive: colores[i], shininess: 10 } );
    }
   
    materialC  = new THREE.MeshStandardMaterial( {
	roughness: 0.2,
	color: 0xffffff,
	metalness: 0.7,
	bumpScale: 0.0005,
	side: THREE.DoubleSide,
	// map: texture
    } );

    /*
    materialC2  = new THREE.MeshStandardMaterial( {
	roughness: 0.6,
	color: 0xffffff,
	metalness: 0.5,
	bumpScale: 0.0005,
	side: THREE.DoubleSide,
    } );
    */

    materialC2 = new THREE.MeshBasicMaterial( {
	map: texture,
	side: THREE.DoubleSide
	//color: diffuseColor,
	//reflectivity: beta,
	//envMap: alpha < 0.5 ? reflectionCube : null
    } );
    
    ofTexture = new THREE.TextureLoader().load( 'of8.89f2fef9.jpg' );

    ofTexture.wrapS = ofTexture.wrapT = THREE.RepeatWrapping;
    ofTexture.offset.set( 0, 0 );
    ofTexture.repeat.set( 64, 64 );
    
    matofTexture  = new THREE.MeshStandardMaterial( {
	roughness: 0.6,
	color: 0xffffff,
	metalness: 0.2,
	bumpScale: 0.0005,
	map: ofTexture, 
	side: THREE.DoubleSide,
    } );
}
    
function texto() {
    /*
    var fontLoader = new THREE.FontLoader();
    fontLoader.load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_regular.typeface.json", function(font ){ 
	const message = "4nti";	
	textGeo = new THREE.TextGeometry( message, {
	    font: font,
	    size: 6,
	    height: 1,
	    curveSegments: 4,
	    bevelThickness: 0.25,
	    bevelSize: 0.5,
	    bevelEnabled: true
	} );
	// textGeo.rotateX( Math.PI );

	textGeo.computeBoundingBox();
	xMid = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
	textGeo.translate( xMid, 0, 0 );
	text = new THREE.Mesh( textGeo, materialC );
	// text.position.z =  1;
	text.rotation.z = Math.PI;

    })
    */

    loader.load( 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/ttf/kenpixel.ttf', function ( json ) {

	let font = new THREE.Font( json );
	// createText();
	
	let textGeo = new THREE.TextGeometry( text, {
	    
	    font: font,
	    
	    size: size,
	    height: height,
	    curveSegments: curveSegments,
	    
	    bevelThickness: bevelThickness,
	    bevelSize: bevelSize,
	    bevelEnabled: true
	    
	} );

	textGeo.computeBoundingBox();
	textGeo.computeVertexNormals();
	
	const centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
	
	textMesh1 = new THREE.Mesh( textGeo, material );
	
	textMesh1.position.x = centerOffset;
	textMesh1.position.y = hover;
	textMesh1.position.z = 0;
	
	textMesh1.rotation.x = 0;
	textMesh1.rotation.y = Math.PI * 2;
	
	group.add( textMesh1 );
	
    } );
    
}

function htmlBar(){
    var i = 0;
	if (i == 0) {
	    i = 1;
	    var elem = document.getElementById("myBar");
	    var width = 1;
	    var id = setInterval(frame, 10);
	    function frame() {
		if (width >= 100) {
		    clearInterval(id);
		    i = 0;
		    // cambiar de escena
		    htmlBar();
		    escena++;

		    rmsc1();
		    rmsc2();
		   
		    switch(escena%numsc){
		    case 0:
			initsc1();
			break;
		    case 1:
			initsc2(); 
			break;
		    case 2:
			initsc3();
			break;
		    }
		    
		} else {
		    width+= 0.2;
		    elem.style.width = width + "%";

		    if(width.toFixed(2) == 97.0){ 
			// composer.addPass( glitchPass );
			glitchPass.goWild = true; 
		    }

		    if(width.toFixed(2) == 2.0){
			glitchPass.goWild = false; 
			//composer.removePass( glitchPass ); 
		    }
		    
		}
	    }
	}
}

function retro(){
    const data = new Uint8Array( textureSize * textureSize * 3 );
    
    texture = new THREE.DataTexture( data, textureSize, textureSize, THREE.RGBFormat );
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
}

async function sonido(){
    
    await Tone.start();
    reverb = new Tone.JCReverb(0.1).connect(panner);
    pitchShift = new Tone.PitchShift().connect(reverb);
    dist = new Tone.Distortion(0.1).connect(pitchShift);

    player = new Tone.Player("geom4.0f7aa2a3.mp3").connect(dist) ;
    player.loop = true;

    antiKick = new Tone.Player("antiKick.51e9f00a.mp3").toDestination() ;
    
    Tone.loaded().then(() => {
	player.start();
    });
    
    reverb.connect(analyser);
    antiKick.connect(analyser); 

    if(buscando){
    setInterval(function(){
	let al = Math.floor(Math.random()*5);
	//console.log(al);
	pitchActual= pitch[al];
	pitchCambio++;
	pitchShift.pitch = pitchActual;
	wetActual = wet[al];
	reverb.wet = wetActual;
    }, 850); // esto podría secuenciarse también ?
    setInterval(function(){
	let al = Math.floor(Math.random()*5)
	reverseActual= reverse[al];
	reverseCambio++;
	player.reverse = reverseActual;
	// scene.background = colores[al] ;
	cambioC++;
    },850);
    setInterval(function(){
	startActual= start[startCambio%5];
	startCambio++;
	player.loopStart = startActual;
	antiKick.start(); 
    }, 850);
    }
    
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();    
    renderer.setSize( window.innerWidth, window.innerHeight );
}

async function detonar(){
    await renderPrediction();
    animate();
    sonido() 
    htmlBar(); 
    loaderHTML.style.display = "none";
    myProgress.style.display = "block";  
    console.log('t4m0sr3dy');
    
}

video = document.getElementById( 'video' );

    // const texture = new THREE.VideoTexture( video );

//texture.wrapS = THREE.RepeatWrapping;
//texture.repeat.x = - 1;
//texture.rotation.y = Math.PI / 2; 

/*

async function oscSend(){

    // osc.open();

    // Creo que cada mitad tiene 16 menos uno 15 - 30 puntos en total  
    // 76 - 93 sin 79
    // 310 - 327 sin 323 

    // keypoints en x
    /*
    osc.on('open', () => {
	setInterval(function(){
	    const message = new OSC.Message('/kpxBoca');
	    for(let i = 76; i < 93; i++){
		if(i != 79){
		    message.add( keypoints[i][0]);
		}
		if((i+234) != 323){
		    message.add( keypoints[i+234][0]); 
		}
	    }
	    osc.send(message);
	    // synth.triggerAttackRelease("C4", "8n"); // para enviar una señal cada cierto tiempo
	}, 1000);
    })
    
    // keypoints en y 

    osc.on('open', () => {
	setInterval(function(){
	    const message = new OSC.Message('/kpyBoca');
	    for(let i = 76; i < 93; i++){
		if(i != 79){
		    message.add( keypoints[i][1]);
		}
		if((i+234) != 323){
		    message.add( keypoints[i+234][1]); 
		}
	    }
	    osc.send(message);
	}, 100);
    })

    // keypoints en z 

    osc.on('open', () => {
	setInterval(function(){
	    const message = new OSC.Message('/kpzBoca');
	    for(let i = 76; i < 93; i++){
		if(i != 79){
		    message.add( keypoints[i][2]);
		}
		if((i+234) != 323){
		    message.add( keypoints[i+234][2]); 
		}
	    }
	    osc.send(message);
	}, 100);
    })    
}

*/
