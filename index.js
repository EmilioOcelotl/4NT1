/ ////////////////////////////////
// ///////// 4NT1 /////////////////
// ////////////////////////////////

import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
// import '@tensorflow/tfjs-backend-cpu';
import * as THREE from 'three';
import {TRIANGULATION} from './js/triangulation';
import * as Tone from 'tone';
import Stats from 'stats.js';
// import {Reflector} from '/Reflector.js'; // lo movi a js
import {EffectComposer} from './jsm/postprocessing/EffectComposer.js';
import {RenderPass} from './jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from './jsm/postprocessing/UnrealBloomPass.js';
import {GlitchPass} from './jsm/postprocessing/GlitchPass.js';
// import { SVGLoader } from '/jsm/loaders/SVGLoader.js';
import {TTFLoader} from './jsm/loaders/TTFLoader.js';
import perlinNoise3d from 'perlin-noise-3d';
// const perlinNoise3d = require('perlin-noise-3d');
import {AfterimagePass} from './jsm/postprocessing/AfterimagePass.js';
// import * as blazeface from '@tensorflow-models/blazeface';
import {ImprovedNoise} from './jsm/math/ImprovedNoise.js'; 

let matofTexture; 
let scene, camera, renderer, material, cube, geometryPoints;
let geometryC, materialC, materialC2;
let cubos = [];
let cuboGrande = new THREE.Mesh(); let cuboGrande2 = new THREE.Mesh();
let grupo;
let font;
let text = new THREE.Mesh(); let text2 = new THREE.Mesh();
let torus = [];
let matArray = [];
let prueba = 4;
let afft = [];
// const analyser = new Tone.Analyser( 'fft', 64 );
let postB = true;

// import perlinNoise3d from 'perlin-noise-3d';

const pGeometry = [new THREE.BufferGeometry(), new THREE.BufferGeometry(), new THREE.BufferGeometry];

const pVertices1 = []; const pVertices2 = []; const pVertices3 = [];

for ( let i = 0; i < 468; i ++ ) {
    const x = Math.random() * 2000 - 1000;
    const y = Math.random() * 2000 - 1000;
    const z = Math.random() * 2000 - 1000;
    pVertices1.push( x, y, z );
    pVertices2.push( x, y, z );
    pVertices3.push( x, y, z );
}

pGeometry[0].setAttribute( 'position', new THREE.Float32BufferAttribute( pVertices1, 3 ) );
pGeometry[1].setAttribute( 'position', new THREE.Float32BufferAttribute( pVertices2, 3 ) );
pGeometry[2].setAttribute( 'position', new THREE.Float32BufferAttribute( pVertices3, 3 ) );

let position = [];

for (var i = 0; i < 3; i++) {
    position[i] = pGeometry[i].attributes.position;
    position[i].usage = THREE.DynamicDrawUsage;
}

// let position = [];
// const pGeometry = new THREE.BufferGeometry();

let geometryB;

let vertices = [];

const panner = new Tone.Panner3D({
	panningModel: 'HRTF',
    }).toDestination();

let points = [];
let normals = [];
//let keypoints = [];
let  keypoints = []; 

let laterales = [];

let geometry = new THREE.BufferGeometry();
let mesh = new THREE.Mesh();
let meshB = new THREE.Mesh();
let degree = 0;
let xMid;

let model, ctx, videoWidth, videoHeight, video;

const loaderHTML = document.getElementById('loaderHTML');
const startButton = document.getElementById( 'startButton' );
const myProgress = document.getElementById( 'myProgress' );
const myBar = document.getElementById( 'myBar' );
const body = document.getElementById( 'body' );

// startButton.addEventListener( 'click', init );

// con boton

document.querySelector('button').addEventListener('click', async () => {

    await Tone.start(); 
    // console.log('audio is ready')
    init(); 
})

// Tone.start().then( (x) => init()) // sin botón 

let colores = [], colores2 = [], colores3 = [];
const stats = new Stats();

let predictions = [];
let container;
let planeB = [];

let composer;
let planeVideo;
let planeBuscando;
let materialVideo;

let escena = 0;

let rendereo;
let buscando = false;

// //////////////////////////////////////////////////////////////////

let numsc = 3;

// //////////////////////////////////////////////////////////////////

let ofTexture;

// let wet = [0.1, 0.2, 0, 0.04]; let wetActual;
// let reverse = [true, false, false, true, false]; let reverseActual; let reverseCambio = 0;
// let pitch = [0, -12, 0, -12, 12, 7, -7]; let pitchActual; let pitchCambio = 0;
// let start = [0.1, 0.5, 0.7, 0.3, 0.9, 1.5, 2.0]; let startActual; let startCambio = 0;

let cambioC = 0;

let pitchShift, reverb, dist;
let player, antiKick;

let seq1, seq2, seq3;

let flow, curve, curveHandles = [];

let textMesh1;

function isMobile() {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isiOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    return isAndroid || isiOS;
}

const mobile = isMobile();

// /////////// Retro

const dpr = window.devicePixelRatio;
let textureSize;

if (mobile) {
    textureSize = 512 * dpr;
    console.log('En movimiento');
} else {
    textureSize = 1024* dpr;
    console.log('Estático');
}

let texture;
const vector = new THREE.Vector2();
// let cuboGrande;
let afterimagePass, bloomPass; 
let porcentaje;

let noise = new perlinNoise3d();
let noiseStep = 0;
let vueltas;

// /////////// Segunda escena

let triaVertices = []; let triaVertices2 = []; let triaVertices3 = []; let triaVertices4 = []; let triaVertices5 = [];

for ( let i = 0; i < 3; i ++ ) {
    const x = Math.random() * 2000 - 1000;
    const y = Math.random() * 2000 - 1000;
    const z = Math.random() * 2000 - 1000;

    triaVertices.push( x, y, z );
}

let triaGeometry = [];
let triaPosition = [];

for (var i = 0; i < 25; i++) {
    triaGeometry[i] = new THREE.BufferGeometry();
    triaGeometry[i].setAttribute( 'position', new THREE.Float32BufferAttribute( triaVertices, 3 ) );
    triaPosition[i] = triaGeometry[i].attributes.position;
    triaPosition[i].usage = THREE.DynamicDrawUsage;
}

let triangulos = [];

let contador = 0;

// let audioSphere = new THREE.SphereBufferGeometry(300, 32, 32);
// let audioSphere2 = new THREE.SphereBufferGeometry(300, 32, 32);

// /////////// Camera

let mouseX = 0;
let mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let aletx=[], alety=[], aletz=[];

let model2;
const annotateBoxes = true;
let landmarks;
let inicio;
let fin, transcurso;
let segundo;

const perlin = new ImprovedNoise();
let intro; 
let gSegundo; 

player = new Tone.Player('audio/fondos/intro.mp3').connect(panner);
player.loop = true;
antiKick = new Tone.Player('audio/perc/antiKick.mp3').toDestination();
const respawn = new Tone.Player('audio/perc/respawn.mp3').toDestination(); 
const out = new Tone.Player('audio/perc/out.mp3').toDestination(); 
intro = new Tone.Player('audio/fondos/espera.mp3').toDestination();
intro.loop = true; 

intro.volume.value = -6;

let glitchPass; 

let stream
let gSignal, gFin, gTranscurso; 

let stopRendering = false;
let irises = false; 
let contriangulos = 0; 

let suspendido = false; 
let modoOscuro = true; 

let txtPosX = 1;
let txtPosY = 1; 


let txtPosX2 = 1;
let txtPosY2 = 1; 

let sprite, sprite2;

let matPoints; 

// Puedo usar los textos como arreglo 

let txtPrueba = [

    "Predicciones",
    "Los comentarios pueden repartirse\ncomo indicaciones y como programacion",
    "Una buena parte del trabajo invertido\nse concentra en la\ndelimitacion escenica",
    "Otra parte del trabajo invertido\n esta en la infraestructura",
    "El análisis de las imágenes\nes una posibilidad de interaccion\n con la maquina",
    "Es necesario algún otro dispositivo\nde interaccion para acceder\na enlaces externos",
    "¿Es redundante usar qr\npara vincular este espacio fisico\ncon el entramado detrás de la obra?",
// # qr con la referencia a la reflexión de documenta 
    "El cubrebocas funciona\ncomo un dispositivo de ofuscacion facial\npor si mismo",
    "Dos tipos de ofuscacion: sonora y visual",

];

// y hacer coincidir el índice con los audios

var voz = new Tone.Players({
  "aun": "audio/voces/aun.mp3",
  // "snare":"samples/505/snare.mp3"
}).toDestination();

var fondos = new Tone.Players({
    "0": "audio/fondos/0.mp3",
    "1": "audio/fondos/1.mp3",
    "2": "audio/fondos/2.mp3",
    "3": "audio/fondos/3.mp3",
    "4": "audio/fondos/4.mp3",
    "5": "audio/fondos/5.mp3",
    "6": "audio/fondos/6.mp3",
    "7": "audio/fondos/7.mp3",
    "8": "audio/fondos/8.mp3",
    "9": "audio/fondos/9.mp3",
    "10": "audio/fondos/10.mp3",
    "11": "audio/fondos/11.mp3",
    "12": "audio/fondos/12.mp3",
    "13": "audio/fondos/13.mp3",
    "14": "audio/fondos/14.mp3",
  // "snare":"samples/505/snare.mp3"
}).toDestination();

let perlinValue;
let perlinAmp; 

// /////////// Setupear la cámara

async function setupCamera() {
    video = document.getElementById('video');
    stream = await navigator.mediaDevices.getUserMedia({
	// 'audio': false,
	'video': {
	    facingMode: 'user',
	  
		width: mobile ? undefined : 640, // antes 640
		height: mobile ? undefined : 480,    
	    
	    // frameRate: {ideal: 10, max: 15},
	}
    });
    
    video.srcObject = stream;
    let {width, height} = stream.getTracks()[0].getSettings();
    console.log('Resolución:'+ `${width}x${height}`); // 640x480
    return new Promise((resolve) => {
	video.onloadedmetadata = () => {
	    resolve(video);
	};
    });
}

async function renderPrediction() {

    if(buscando){
	fin = Date.now();
	transcurso = (fin - inicio) / 1000;
     }
    
    // score(transcurso, 10);

    score();
    
    predictions = await model.estimateFaces({
	input: video,
	returnTensors: false,
	flipHorizontal: false,
	predictIrises: irises,
    });

    if (prueba != predictions.length) {
	initsc0();
    }

    prueba = predictions.length;
    // materialVideo.needsUpdate = true;

    vueltas = 0;

    if (predictions.length > 0) {
	predictions.forEach((prediction) => {
	    keypoints = prediction.scaledMesh;

	    for (let i = 0; i < TRIANGULATION.length / 3; i++) {
		points = [
		    TRIANGULATION[i * 3], TRIANGULATION[i * 3 + 1],
		    TRIANGULATION[i * 3 + 2],
		].map((index) => keypoints[index]);
	    }
	   
	    if (buscando) {
		switch ( escena % numsc ) {
		case 0:
		    animsc1();
		    break;
		case 1:
		    animsc2();
		    break;
		}
	    }
	});
    }

    // ///////////////// rotación en z de la cara

    if (predictions.length > 0) {
	const {annotations} = predictions[0]; // solo agarra una prediccion
	const [topX, topY] = annotations['midwayBetweenEyes'][0];
	const [rightX, rightY] = annotations['rightCheek'][0];
	const [leftX, leftY] = annotations['leftCheek'][0];
	const bottomX = (rightX + leftX) / 2;
	const bottomY = (rightY + leftY) / 2;
	degree = Math.atan((topY - bottomY) / (topX - bottomX));

	text.position.x = keypoints[0][0]* 0.1 -35 + txtPosX;
	text.position.y = keypoints[0][1]* 0.1 -30 + txtPosY;
	text.position.z = keypoints[0][2] * 0.1 + 10;

	text2.position.x = keypoints[0][0]* 0.1 -35 + txtPosX2;
	text2.position.y = keypoints[0][1]* 0.1 -30 + txtPosY2;
	text2.position.z = keypoints[0][2] * 0.1 + 10;
	
	
    } else {
	
	text.position.x = txtPosX;
	text.position.y = txtPosY;
	text.position.z = 0;

	
    }

   
    
    /*
    text2.position.x = keypoints[0][0]* 0.1 - 40;
    text2.position.y = keypoints[0][1]* 0.1 - 20;
    text2.position.z = keypoints[0][2] * 0.1 + 10;
    */

    cuboGrande.rotation.x += 0.003;
    cuboGrande.rotation.y += (degree) * 0.006;
    ///text.rotation.y = degree * 2 + (Math.PI );
    //text2.rotation.y = degree * 2 + (Math.PI );


    /*
    audioSphere.computeVertexNormals();
    audioSphere.normalsNeedUpdate = true;
    audioSphere.verticesNeedUpdate = true;

    let vertss = audioSphere.attributes.position.array.count;
    console.log(vertss)
    console.log(triaGeometry[0].vertices);

    if(buscando){

	for(var i  = 0; i < audioSphere.attributes.position.count; i++){

	    const analisis = Tone.dbToGain ( analyser.getValue()[i%64] ) * 20;
	    audioSphere.attributes.position.array[i].x = audioSphere2.attributes.position.array[i].x * analisis;

	}

    }
    */

    //mouseX = ( keypoints[168][0] - windowHalfX ) / 10;
    //mouseY = ( keypoints[168][1] - windowHalfY ) / 10;

    // /console.log( Math.abs(mouseX) - 32, );

    //camera.position.x += ( Math.abs(mouseX)- 36 - camera.position.x ) * .05;
    // camera.position.y += ( Math.abs(mouseY)- 24 - camera.position.y ) * .05;

    camera.lookAt( scene.position );

    camera.rotation.z = Math.PI;

    stats.update();

    renderer.render( scene, camera );

    panner.positionX.value = 0;

    vertices = [];

    composer.render();

    /*
    if(buscando || suspendido ){
	vector.x = ( window.innerWidth * dpr / 2 ) - ( textureSize / 2 );
	vector.y = ( window.innerHeight * dpr / 2 ) - ( textureSize / 2 );
	
	renderer.copyFramebufferToTexture( vector, texture );
    }
    */
    
    // rmtexto();

    // activación del glitch solo en escritorio ¿Esto realmente importa? 

    if(!mobile){
	gTranscurso = (gFin - gSignal) / 1000;
	
	// console.log(gTranscurso.toFixed()); 
	if(gTranscurso.toFixed() == 1 && gSegundo != 1){
	    // console.log("Cambio");
	    gSegundo = gTranscurso.toFixed();
	    glitchPass.goWild = false;
	    composer.removePass( glitchPass );
	    
	} else {
	    gSegundo = 0; 
	}
	
	gFin = Date.now(); 
	
    }
    
    requestAnimationFrame(renderPrediction);
};

// /////////////////////// Inicialización

async function init() {

    await tf.setBackend('webgl');

    const overlay = document.getElementById( 'overlay' );
    overlay.remove();

    const info = document.getElementById( 'info' );
    info.remove();

    const fonca = document.getElementById( 'fonca' );
    fonca.remove();

    // loaderHTML.style.display = 'block';
    // const body = document.getElementById( 'body'); 
    // body.style.cursor = 'none'; 

    container = document.createElement( 'div' );
    document.body.appendChild( container );
    document.body.style.cursor = 'none'; 
    await setupCamera();

    ////////////////////////////////////////////////////////////////////

    // Esto se puede comentar ? // 
    
    video.play(); 

    ////////////////////////////////////////////////////////////////////
    
    videoWidth = video.videoWidth;
    videoHeight = video.videoHeight;
    video.width = videoWidth;
    video.height = videoHeight;

    scene = new THREE.Scene();
    // scene.background = new THREE.Color( 0x000000 ); // UPDATED

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    camera.position.z = 40;
    camera.rotation.z = Math.PI;

    const ambient = new THREE.AmbientLight( 0xffffff );
    scene.add( ambient );
    
    pointLight = new THREE.PointLight( 0xffffff, 2 );
    scene.add( pointLight );
    
    cols();

    let {width, height} = stream.getTracks()[0].getSettings();
    console.log('Resolución:'+ `${width}x${height}`); // 640x480

    const geometryVideo = new THREE.PlaneGeometry( width/7, height/7 ); // Dos modalidades, abierta y ajustada para cel

    /*
    materialVideo = new THREE.MeshStandardMaterial( {
	color: 0xffffff,
	refractionRatio: 0.98,
	reflectivity: 0.9,
	opacity: 0.7,
	transparent: true,
	roughness: 0.1,
	metalness: 1,
    } );
*/
    
    materialVideo = new THREE.MeshBasicMaterial( {
	color: 0xffffff,
	side: THREE.DoubleSide,
	transparent: true,
	opacity: 0.9,
    } );

    
    planeVideo = new THREE.Mesh( geometryVideo, materialVideo );
    planeVideo.rotation.x = Math.PI;
    planeVideo.position.z = -10;
    // scene.add( planeVideo );

    retro();
    materiales();

    sprite = new THREE.TextureLoader().load( 'img/smoke_05.png' );
    sprite2 = new THREE.TextureLoader().load( 'img/spark1.png' );

   
    matPoints = new THREE.PointsMaterial( {
	color: colores[0],
	size: 4,
	map: sprite,
	blending: THREE.AdditiveBlending,
	// transparent: true,
	//opacity: 0.5,
	// sizeAttenuation: true,
	alphaTest: 0.1,
	// depthTest: false
    } );
   
    planeB = [new THREE.Points( pGeometry[0], matPoints ), new THREE.Points( pGeometry[1], matPoints ), new THREE.Points( pGeometry[2], matPoints )];

    for (var i = 0; i < 3; i++) {
	pGeometry[i].verticesNeedUpdate = true;
    }

    const triMat = new THREE.MeshStandardMaterial( {
	color: 0xccddff,
	// refractionRatio: 0.98,
	// reflectivity: 0.9,
	opacity: 0.7,
	transparent: true,
	roughness: 0.1,
	metalness: 1,

    } );

    // let triMat = new THREE.MeshBasicMaterial( {color: 0x000000, blending: THREE.AdditiveBlending});

    for (var i = 0; i < 25; i++) {
	triangulos[i] = new THREE.Mesh( triaGeometry[i], triMat );
	triangulos[i].position.z = 10;
	triaGeometry[i].verticesNeedUpdate = true;
    }

    geometryB = new THREE.BufferGeometry();
    geometryB.verticesNeedUpdate = true;

    let audioSphere = new THREE.BoxGeometry( 400, 400, 400, 8, 8, 8 );

    
    // cuboGrande = new THREE.Mesh(audioSphere, materialC2 );

    // var geometryGrande = new THREE.BufferGeometry();

    // geometryGrande.copy(cuboGrandeGeometry);

    // cuboGrandeGeometry = new THREE.IcosahedronGeometry( 200, 1 );
    // cuboGrandeGeometry = new THREE.SphereGeometry( 200, 32, 32 );
    // scene.add( cuboGrande); 
    // cuboGrande.visible = false;

    // cuboGrande.position.x = 10;
    // cuboGrande.position.y = 10;
    // cuboGrande.position.z = 10;
    // cuboGrande2 = new THREE.Mesh(audioSphere, materialC2 );

    // audioSphere.computeVertexNormals();
    // audioSphere.normalsNeedUpdate = true;
    // audioSphere.verticesNeedUpdate = true;

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

    /*
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = Math.pow(2, 4.0 );
    */
    
    document.body.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize );

    container.appendChild( stats.dom );

    // renderer.setPixelRatio(0.75);

    const renderScene = new RenderPass( scene, camera );

    bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );

    composer = new EffectComposer( renderer );
    composer.addPass( renderScene );

    composer.addPass( bloomPass );

    afterimagePass = new AfterimagePass();
    composer.addPass( afterimagePass );

    afterimagePass.uniforms['damp'].value = 0.85;

    glitchPass = new GlitchPass();
    // composer.addPass( glitchPass );

    model = await faceLandmarksDetection.load(
	faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
	{maxFaces: 3,
	 shouldLoadIrisModel: false,
	 maxContinuousChecks: 120});

    detonar();
    
}

function initsc0() {

    irises = false; 
    gSignal = Date.now();
    
    composer.addPass( glitchPass );
    glitchPass.goWild = true;
    
    if ( predictions.length < 1 ) {
			
	out.start();
	scene.add(planeVideo); 
	planeVideo.material.opacity = 1; 
	materialVideo.map = new THREE.TextureLoader().load( 'img/siluetaNeg.png' );
	materialVideo.map.wrapS = THREE.RepeatWrapping;
	materialVideo.map.repeat.x = - 1;

	planeVideo.geometry.dispose();
	const geometryVideoNew = new THREE.PlaneGeometry( 480/15, 640/15 ); // Dos modalidades, abierta y ajustada para cel

	planeVideo.geometry = geometryVideoNew; 
	// materialVideo.map.rotation.y = Math.PI / 2; // por alguna razon hay que comentar esto 

	// sustituir el switch por un TODO se resetea 

	// escena = 0; 
	// transcurso = 0; 
	
	rmsc1();
	rmsc2();
	rmbloomsc();
	modoOscuro = true;

	// este chtexto tendría que llevar el modo correspondiente 

	chtexto(
	    txtPrueba[Math.floor(Math.random()*txtPrueba.length)],
	    Math.random()*40 - 20,
	    Math.random()*40 - 20
	); 
    	
	buscando = false;
	scene.remove( cuboGrande ); // necesario disposear todo ?

	player.stop();
	intro.restart();
	intro.start();

	bloomPass.threshold = 0.7;
	bloomPass.strength = 0.5;
	bloomPass.radius = 0;

    } else {

	planeVideo.geometry.dispose();
	const geometryVideoNew = new THREE.PlaneGeometry( 640/7, 480/7 ); // Dos modalidades, abierta y ajustada para cel

	planeVideo.geometry = geometryVideoNew; 
	materialVideo.map = new THREE.VideoTexture( video );
	respawn.start(); 

	escena = 0; 
	initsc1();

	transcurso = 0; 
	inicio = Date.now();
	segundo = 0;
	
	// antes aquí iba un switch, ahora score se encarga del problema 

	modoOscuro = false;

	chtexto(
	    txtPrueba[Math.floor(Math.random()*txtPrueba.length)],
	    Math.random()*40 - 20,
	    Math.random()*40 - 20
	); 
    
	buscando = true;
	// scene.add( cuboGrande );
	scene.add( text );
	scene.add( text2 );
	// Tone.Destination.mute = false;
	/*
	player.mute = false;
	intro.mute = true; 
	*/
	player.restart(); 
	// player.start(); // Revisar si esto es necesario 
	intro.stop();

	bloomPass.threshold = 0.9;
	bloomPass.strength = 0.2;
	bloomPass.radius = 0;

    }
}

function initsc1() {

    // respawn.start(); // otro sonido que no sea respawn 
    
    afterimagePass.uniforms['damp'].value = 0.85;

    bloomPass.threshold = 0.7;
    bloomPass.strength = 0.2;
    bloomPass.radius = 0;

    perlinValue = 0.03;
    perlinAmp = 4; 
    matPoints.map= sprite;
    matPoints.size=6; 
    scene.add( planeVideo);

    planeVideo.material.opacity = 0; 
    // scene.remove( planeVideo ); 
    // scene.add(cuboGrande); 
    
    chtexto(
	txtPrueba[Math.floor(Math.random()*txtPrueba.length)],
	Math.random()*40 - 20,
	Math.random()*40 - 20
    ); 
    
    if (predictions.length > 0) {
	for (let i = 0; i < planeB.length; i++) {
	    scene.remove( planeB[i] );
	}
    }

    let cuentaPlane = 0;

    if (predictions.length > 0) {
	predictions.forEach((prediction) => {
	    scene.add( planeB[cuentaPlane] );
	    cuentaPlane++;
	});
    }
}

// dos correcciones de acuerdo a la resolución. Pienso que esto tiene que ver con el modo horizontal o vertical. Cada navegador hace lo que quiere y firefox nunca me deja jalar la cámara en módo vertical 

function animsc1() {

    // console.log(4-(transcurso/40*4));

    perlinValue = 0.03-(transcurso/40*0.03); 
    perlinAmp = 4 - (transcurso/40*4); 
    planeVideo.material.opacity = transcurso/40; 
    
    var time2 = Date.now() * 0.0005;

    for ( let i = 0; i < position[vueltas].count; i ++ ) {

	// Blet d = perlin.noise(keypoints[i][0] * 0.003  + time2, keypoints[i][1]*0.003+time2, keypoints[i][2]* 0.003+time2) * 4; 

	let d = perlin.noise(
	    keypoints[i][0] * perlinValue + time2,
	    keypoints[i][1] * perlinValue + time2,
	    keypoints[i][2] * perlinValue + time2) *  perlinAmp; 

	// let d = 0;
	
	// const analisis = Tone.dbToGain ( analyser.getValue()[i%64] ) * 20;
	position[vueltas].setX( i, (1+keypoints[i][0] * 0.1 - 33) *(2+d) ); // antes 1+analisis
	position[vueltas].setY( i, (1+keypoints[i][1] * 0.1 - 25) * (2+d));
	position[vueltas].setZ( i, keypoints[i][2] * 0.05  * (4+d) );
    }

    planeB[vueltas].geometry.computeVertexNormals();
    planeB[vueltas].geometry.attributes.position.needsUpdate = true;
    position[vueltas].needsUpdate = true;
    vueltas++;
}

function rmsc1() {
   for (let i = 0; i < planeB.length; i++) {
	scene.remove( planeB[i] );
    }
}

// Escena 2

function initsc2() {

    respawn.start();

    afterimagePass.uniforms['damp'].value = 0.5;

    bloomPass.threshold = 0.5;
    bloomPass.strength = 0.1;
    bloomPass.radius = 0;
    
    matPoints.map= sprite;
    matPoints.size= 5; 

    planeVideo.material.opacity = 0; 
    scene.add( planeVideo);
    
    chtexto(
	txtPrueba[Math.floor(Math.random()*txtPrueba.length)],
	Math.random()*40 - 20,
	Math.random()*40 - 20
    ); 
    
    if (predictions.length > 0) {
	for (let i = 0; i < planeB.length; i++) {
	    scene.remove( planeB[i] );
	}
    }

    let cuentaPlane = 0;

    if (predictions.length > 0) {
	predictions.forEach((prediction) => {
	    scene.add( planeB[cuentaPlane] );
	    cuentaPlane++;
	});
    }
}

// dos correcciones de acuerdo a la resolución. Pienso que esto tiene que ver con el modo horizontal o vertical. Cada navegador hace lo que quiere y firefox nunca me deja jalar la cámara en módo vertical 

function animsc2() {
    
    var time2 = Date.now() * 0.0005;

    for ( let i = 0; i < position[vueltas].count; i ++ ) {

	// Blet d = perlin.noise(keypoints[i][0] * 0.003  + time2, keypoints[i][1]*0.003+time2, keypoints[i][2]* 0.003+time2) * 4; 

	let d = perlin.noise(keypoints[i][0] * 0.003  + time2, keypoints[i][1]*0.003+time2, keypoints[i][2]* 0.003+time2) *  1; 

	// let d = 0;
	
	// const analisis = Tone.dbToGain ( analyser.getValue()[i%64] ) * 20;
	position[vueltas].setX( i, (1+keypoints[i][0] * 0.1 - 33) *(1+d) ); // antes 1+analisis
	position[vueltas].setY( i, (1+keypoints[i][1] * 0.1 - 25) * (1+d));
	position[vueltas].setZ( i, keypoints[i][2] * 0.05  * (4+d) );
    }

    planeB[vueltas].geometry.computeVertexNormals();
    planeB[vueltas].geometry.attributes.position.needsUpdate = true;
    position[vueltas].needsUpdate = true;
    vueltas++;
}

function rmsc2() {
   for (let i = 0; i < planeB.length; i++) {
	scene.remove( planeB[i] );
    }
}


// Escena obscura1

function initbloomsc(){

    suspendido = true;
    scene.remove( cuboGrande );
    respawn.start();

    chtexto(
	txtPrueba[Math.floor(Math.random()*txtPrueba.length)],
	Math.random()*40 - 20,
	Math.random()*40 - 20
   ); 
    
    scene.remove( planeVideo ); 
    
}

function animbloomsc(){

}

function rmbloomsc(){

}

// Escena oscura 2

function initbloomsc2(){

    suspendido = true;
    scene.remove( cuboGrande );
    respawn.start();


    chtexto(txtPrueba[
	Math.floor(Math.random()*txtPrueba.length),
	Math.random()*20 - 10,
	Math.random()*20 - 10
    ]); 

    
    scene.remove( planeVideo ); 
    // quitar texto
    // agregar texto
    
}

function animbloomsc2(){
}

function rmbloomsc2(){
}


// Podría ser que hasta aquí haya más texto que en las escenas anteriores 

function initIrises(){
    irises = true;
}

function animIrises(){
}

function rmIrises(){
    irises = false; 
}

function texto() {

    // const color = 0x000000; // para el additiveblending
    const color = 0xffffff;

    const matLite = new THREE.MeshBasicMaterial( {
	color: 0xffffff,
	// transparent: true,
	// opacity: 0.8,
	side: THREE.DoubleSide,
	// blending: THREE.AdditiveBlending,
	// transparent: true,
    } );

    const matLite2 = new THREE.MeshBasicMaterial( {
	    color: 0xffffff,
	    // transparent: true,
	    // opacity: 0.8,
	    side: THREE.DoubleSide,
	//blending: THREE.AdditiveBlending,
	    // transparent: true,
    } );

    const loader1 = new THREE.FontLoader();

    loader1.load( 'fonts/techno.json', function( font ) {

	const message = txtPrueba[2];
	const shapes = font.generateShapes( message, 2 );
	const geometry = new THREE.ShapeGeometry( shapes );
	geometry.computeBoundingBox();

	const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
 	geometry.translate( xMid, 0, 0 );
	text = new THREE.Mesh( geometry, matLite );
	text.position.z = 5;
	// text.rotation.x = Math.PI;
	// text.rotation.y = Math.PI;
	text.rotation.z = Math.PI;
	scene.add( text );

	text2 = new THREE.Mesh( geometry, matLite2 );
	text2.position.z = 5;
	// text.rotation.x = Math.PI;
	// text.rotation.y = Math.PI;
	text2.rotation.z = Math.PI;
	scene.add( text2 );
	
    });
	
}

function chtexto( mensaje, mensaje2, posX,  posY, posX2, posY2 ) {
    
    const loader1 = new THREE.FontLoader();
    loader1.load( 'fonts/techno.json', function( font ) {
	
	txtPosX = posX;
	txtPosY = posY;
	
	txtPosX2 = posX2;
	txtPosY2 = posY2;
	
	const matLite = new THREE.MeshBasicMaterial( {
	    color: 0xffffff,
	    // transparent: true,
	    // opacity: 0.8,
	    side: THREE.DoubleSide,
	    blending: THREE.AdditiveBlending,
	    // transparent: true,
	} );
	
	const matLite2 = new THREE.MeshBasicMaterial( {
	    color: 0xffffff,
	    // transparent: true,
	    // opacity: 0.8,
	    side: THREE.DoubleSide,
	    // blending: THREE.AdditiveBlending,
	    // transparent: true,
    } );
	
	const message = mensaje; 
	const shapes = font.generateShapes( message, 0.75 );
	const geometry = new THREE.ShapeGeometry( shapes );
	geometry.computeBoundingBox();
	const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
	geometry.translate( xMid, 0, 0 );
	text.geometry.dispose(); 
	text.geometry= geometry;
	text.material.dispose();

	const message2 = mensaje2; 
	const shapes2 = font.generateShapes( message2, 0.75 );
	const geometry2 = new THREE.ShapeGeometry( shapes2 );
	geometry2.computeBoundingBox();
	const xMid2 = - 0.5 * ( geometry2.boundingBox.max.x - geometry2.boundingBox.min.x );
	geometry2.translate( xMid2, 0, 0 );
	text2.geometry.dispose(); 
	text2.geometry= geometry2;
	text2.material.dispose();

	
	/*
	if(!modoOscuro){
	    text.material= matLite;
	} else {
	    text.material= matLite2; 
	}
	*/
	
    });
}

function retro() {
    const data = new Uint8Array( textureSize * textureSize * 3 );

    texture = new THREE.DataTexture( data, textureSize, textureSize, THREE.RGBFormat );
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
}

async function sonido() {

    // esto tiene que ver con escenas

    // let intervalo; 
   
    const loop = new Tone.Loop((time) => {
	// triggered every eighth note.
	//console.log(time);
	
	chtexto(
	    txtPrueba[Math.floor(Math.random()*txtPrueba.length)],
	    txtPrueba[Math.floor(Math.random()*txtPrueba.length)],
	    Math.random()*20 - 10,
	    Math.random()*20 - 10,
	    Math.random()*20 - 10,
	    Math.random()*20 - 10
	); 

	let fondosAl = Math.floor(Math.random()*14);
	fondos.player(fondosAl.toString()).start(time);

	//intervalo = Math.random() * 20;
	console.log(fondosAl); 
	
    }, "10").start(0);

    Tone.Transport.start();
   
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

async function detonar() {
    await renderPrediction();
    sonido();
    console.log('██╗  ██╗███╗   ██╗████████╗ ██╗\n██║  ██║████╗  ██║╚══██╔══╝███║\n███████║██╔██╗ ██║   ██║   ╚██║\n╚════██║██║╚██╗██║   ██║    ██║\n     ██║██║ ╚████║   ██║    ██║\n     ╚═╝╚═╝  ╚═══╝   ╚═╝    ╚═╝'); // fps();
    inicio = Date.now();
    respawn.start(); 
}

// Ajustar duraciones

///////////////////////////////////////////////7
//// IMPORTANTE: ¿Con esto es necesario activar/desactivar con initsc0? Sip
//// iMPORTANTE2: ¿Podría hacerse con los secuenciadores de tone.js ? No se sabe
///////////////////////////////////////////////

function score() {

    if(buscando){

    // Por defecto inicia en la primer escena 
    
	if ( transcurso.toFixed() == 40 && segundo != 40 ) {
	    console.log("primera escena"); 
	    segundo = transcurso.toFixed();
	    // aquí puede ir algo asociado a las predicciones 
	    modoOscuro = false; 
	    escena = 1;
	    
	    rmsc1();
	    rmsc2();
	    rmbloomsc();
	    rmbloomsc2(); 

	    initsc2();
	    
	}

	if ( transcurso.toFixed() == 80 && segundo != 80 ) {
	    console.log("segunda escena"); 
	    segundo = transcurso.toFixed();
	    modoOscuro = true; 
	    escena = 2;
	    rmsc1();
	    rmsc2();
	    rmbloomsc();
	    rmbloomsc2();
	    
	    initbloomsc();
	    
	}


	if ( transcurso.toFixed() == 120 && segundo != 120 ) {
	    console.log("tercera escena"); 
	    segundo = transcurso.toFixed();
	    modoOscuro = true; 
	    escena = 2;

	    rmsc1();
	    rmsc2();
	    rmbloomsc();
	    rmbloomsc2();
	    
	    initbloomsc2();
	    
	}

	
	if ( transcurso.toFixed() == 160 && segundo != 160 ) {
	    console.log("cuarta escena"); 
	    segundo = transcurso.toFixed();
	    modoOscuro = true; 
	    escena = 2;

	    rmsc1();
	    rmsc2();
	    rmbloomsc();
	    rmbloomsc2();
	    
	    initIrises();
	    
	}

	
	if ( transcurso.toFixed() == 200 && segundo != 200 ) {
	    console.log("quinta escena transición"); 
	    segundo = transcurso.toFixed();
	    modoOscuro = true; 
	    escena = 2;
	    rmsc1();
	    rmsc2();
	    rmbloomsc(); 
	    initbloomsc(); 
	}		
	
    }
}


function cols() {
    colores2 = [new THREE.Color( 0x711c91 ),
	       new THREE.Color( 0xea00d9 ),
	       new THREE.Color( 0x0adbc6 ),
	       new THREE.Color( 0x133e7c ),
	       new THREE.Color( 0x000000 )];

    colores = [new THREE.Color( 0x711c91 ),
	       new THREE.Color( 0xea00d9 ),
	       new THREE.Color( 0x0adbc6 ),
	       new THREE.Color( 0x133e7c ),
	       new THREE.Color( 0x000000 )];

    colores3 = [new THREE.Color( 0xffffff ),
		new THREE.Color( 0xffffff ),
		new THREE.Color( 0xffffff ),
		new THREE.Color( 0xffffff ),
		new THREE.Color( 0xffffff )];
}

function materiales() {
    for (let i = 0; i < 4; i++) {
	matArray[i] = new THREE.MeshPhongMaterial( {color: 0x000000, specular: colores[i%2], emissive: colores[i], shininess: 10} );
    }

    materialC = new THREE.MeshStandardMaterial( {
	roughness: 0.2,
	color: 0xffffff,
	metalness: 0.7,
	bumpScale: 0.0005,
	side: THREE.DoubleSide,
	// map: texture
    } );

    materialC2 = new THREE.MeshBasicMaterial( {
	map: texture,
	side: THREE.DoubleSide,
	// color: diffuseColor,
	// reflectivity: beta,
	// envMap: alpha < 0.5 ? reflectionCube : null
    } );

    ofTexture = new THREE.TextureLoader().load( 'img/of8.jpg' );

    ofTexture.wrapS = ofTexture.wrapT = THREE.RepeatWrapping;
    ofTexture.offset.set( 0, 0 );
    ofTexture.repeat.set( 64, 64 );

    matofTexture = new THREE.MeshStandardMaterial( {
	roughness: 0.6,
	color: 0xffffff,
	metalness: 0.2,
	bumpScale: 0.0005,
	map: ofTexture,
	side: THREE.DoubleSide,
    } );
}


video = document.getElementById( 'video' );

// const texture = new THREE.VideoTexture( video );

// texture.wrapS = THREE.RepeatWrapping;
// texture.repeat.x = - 1;
// texture.rotation.y = Math.PI / 2;

/*

// para osc

// const OSC = require('osc-js'); // pal osc
// const osc = new OSC();
// const osc = new OSC({ plugin: new OSC.WebsocketServerPlugin() })


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

/*

function htmlBar(){
    var i = 0;
	if (i == 0) {
	    i = 1;
	    //var elem = document.getElementById("myBar");
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

		    switch( escena % numsc ){
		    case 0:
			initsc1();
			break;
		    case 1:
			initsc2();
			break;
		    }

		} else {
		    width+= 0.2;
		    porcentaje = width.toFixed(2);

		    // esto estaba comentado
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
*/
