
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection'
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl'; 
import '@tensorflow/tfjs-backend-cpu';
import * as THREE from 'three';

import {TRIANGULATION} from './triangulation'; // Qué es esto 

import * as Tone from 'tone';
import Stats from 'stats.js';

// const OSC = require('osc-js'); // pal osc 
// const osc = new OSC(); 
// const osc = new OSC({ plugin: new OSC.WebsocketServerPlugin() })

let luces = []; 
let clight1, clight2, clight3, clight4; 

let scene, camera, renderer, material, cube, geometryPoints; 
let geometryC, materialC; 
let cubos = [];
let grupo; 
let font; 
let text = new THREE.Mesh(); 
let torus = []; 
let matArray = []; 

const NUM_KEYPOINTS = 468; // 468

let points = [];
let normals = [];
let keypoints = new Float32Array;  
let pointcloud; 

let geometry = new THREE.BufferGeometry();
let mesh =  new THREE.Mesh(); 
let degree;
let xMid; 

let model, ctx, videoWidth, videoHeight, video;

const VIDEO_SIZE = 800;
// const renderPointcloud = mobile === false;
// const synth = new Tone.Synth().toDestination();

const startButton = document.getElementById( 'startButton' );
startButton.addEventListener( 'click', init  );

let colores = []; 
const stats = new Stats();

let container; 

// container.appendChild( stats.dom );

/*
function isMobile() {
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isiOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  return isAndroid || isiOS;
}

const mobile = isMobile();

*/

async function setupCamera() {
    video = document.getElementById('video');
    
    const stream = await navigator.mediaDevices.getUserMedia({
	'audio': false,
	'video': {
	    facingMode: 'user',  
      width : VIDEO_SIZE,
      height: VIDEO_SIZE	},
    });
    
    video.srcObject = stream;
    
    return new Promise((resolve) => {
	video.onloadedmetadata = () => {
	    resolve(video);
	};
    });
}

async function renderPrediction() {

    const predictions = await model.estimateFaces({
	input: video,
	returnTensors: false,
	flipHorizontal: false,
	predictIrises: false

    });
    
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

    if (predictions.length > 0) {
	const { annotations } = predictions[0];
	const [topX, topY] = annotations['midwayBetweenEyes'][0];
	const [rightX, rightY] = annotations['rightCheek'][0];
	const [leftX, leftY] = annotations['leftCheek'][0];
	const bottomX = (rightX + leftX) / 2;
	const bottomY = (rightY + leftY) / 2;
	degree = Math.atan((topY - bottomY) / (topX - bottomX));
    }
    
    requestAnimationFrame(renderPrediction);
    
};

async function init() {

    const overlay = document.getElementById( 'overlay' );
    overlay.remove();

    const info = document.getElementById( 'info' );
    info.remove();


    container = document.createElement( 'div' );
    document.body.appendChild( container );
    
    console.log('tamos redy');
    
    await tf.setBackend('webgl'); // ajustar esto dependiendo de las capacidades de la chompu? 
    await setupCamera();
    video.play();

    stats.showPanel(0);  // 0: fps, 1: ms, 2: mb, 3+: custom

    videoWidth = video.videoWidth;
    videoHeight = video.videoHeight;
    video.width = videoWidth;
    video.height = videoHeight;

    model = await faceLandmarksDetection.load(
	faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
	{maxFaces: 3}); // número de caras, esto tal vez tiene que reiniciarse para funcionar 
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

   
    colores = [new THREE.Color( 0x80e8dd ),
	       new THREE.Color( 0x7cc2f6 ),
	       new THREE.Color( 0xaf81e4 ),
	       new THREE.Color( 0xe784ba ),
	       new THREE.Color( 0x000000 ) ]; 

    for(let i = 0; i < 4; i++){
	luces[i] = new THREE.PointLight(colores[i], 0.5);
	scene.add( luces[i] ); 
    }
    
    // const geometryVideo = new THREE.CylinderGeometry( 25, 25, 0.2, 128, true );

    const geometryVideo = new THREE.PlaneGeometry( 50, 50 );
    const materialVideo = new THREE.MeshBasicMaterial( {color: 0xffffff, map:texture, side: THREE.DoubleSide} );
    const planeVideo = new THREE.Mesh( geometryVideo, materialVideo );
    planeVideo.rotation.x = Math.PI;
    // planeVideo.rotation.x = -Math.PI / 2;
    // planeVideo.rotation.y = -Math.PI / 2;
    // planeVideo.rotation.z = Math.PI / 2;
    planeVideo.position.z = -10; 
    scene.add( planeVideo );
    
    geometryC = new THREE.SphereGeometry( 0.75, 3, 4 );

    for(var i = 0; i < 4; i++){
	matArray[i] =  new THREE.MeshPhongMaterial( { color: 0x000000, specular: colores[i%2], emissive: colores[i], shininess: 80, opacity: 0.9, transparent: true } );
    }
    
        
    // let materialC = new THREE.MeshPhongMaterial( { color: 0xdddddd, specular: 0x009900, shininess: 30, flatShading: true } )

   /* 
    let materialC = new THREE.MeshStandardMaterial( {
	color: 0xffffff,
	// map: texture, 
	// refractionRatio: 0.75
	roughness: 0,
	metalness: 1,
	side: THREE.DoubleSide
	} );*/
   
    let materialC  = new THREE.MeshStandardMaterial( {
	roughness: 0.6,
	color: 0xffffff,
	metalness: 0.1,
	bumpScale: 0.0005,
	map: texture
    } );
   
    
  /*  
    const materialC = new THREE.ShaderMaterial( {
	uniforms: uniforms,
	vertexShader: shader.vertexShader,
	fragmentShader: shader.fragmentShader
    } );
;
  */
    
    grupo = new THREE.Group();

    for(let i = 0; i < NUM_KEYPOINTS; i++){
	const al = Math.random() * 4 + 1; 
	// const geometryC = new THREE.CylinderGeometry( al, al, 0.3, 128, true, 0 );
	//const geometry = new THREE.TorusGeometry( , 3, 16, 100 );

	cubos[i] = new THREE.Mesh(geometryC, materialC);
	cubos[i].rotation.x = Math.random() * Math.PI ;
	cubos[i].rotation.y = Math.random() * Math.PI ; 
	cubos[i].rotation.z = Math.random() * Math.PI ;
	cubos[i].scale.x = Math.random() * 2+1;
	cubos[i].scale.y = Math.random() * 1.5+1; 
	//cubos[i].scale.z = Math.random() * 1.0; 
	scene.add( cubos[i] );
    }
    								      
    camera.position.z = 40;
    camera.rotation.z = Math.PI; 
    
    var fontLoader = new THREE.FontLoader();
    fontLoader.load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_regular.typeface.json", function(font ){ 

	const message = "4nti";
	
	textGeo = new THREE.TextGeometry( message, {
	    font: font,
	    size: 6,
	    height: 1,
	    curveSegments: 4,
	    bevelThickness: 0.5,
	    bevelSize: 0.1,
	    bevelEnabled: true
	} );

	textGeo.computeBoundingBox();
	xMid = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
	textGeo.translate( xMid, 0, 0 );
	// make shape ( N.B. edge view not visible )
	text = new THREE.Mesh( textGeo, materialC );
	// text.position.z =  1;
	text.rotation.z = Math.PI;	
	scene.add( text );

    })

    for(var i = 0; i < 5; i++){
	const al = Math.random() * 10 + 32; 
	//const geometry = new THREE.CylinderGeometry( al, al, 0.4, 128, true, 0 );
	const geometry = new THREE.TorusGeometry( al, 0.3, 16, 100 );
	torus[i] = new THREE.Mesh( geometry, materialC );
	scene.add( torus[i] );
	torus[i].position.z = -10;
	// torus[i].position.x = Math.random() * 4 + 10; 
    }

    const gCube = new THREE.TorusKnotGeometry( 5, 1, 100, 16 );

    // const gCube = new THREE.BoxGeometry( 10, 10, 10 );
    const mCube = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    cube = new THREE.Mesh( gCube, materialC  );
    scene.add( cube );
    
    renderer = new THREE.WebGLRenderer({alpha:true, antialias: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize );

    detonar(); 
    // await animate();

    container.appendChild( stats.dom );

    
}

async function animate () {

    var time2 = Date.now() * 0.0005;

    requestAnimationFrame( animate );

    for(var i = 0; i < 4; i++){	
	luces[i].position.x = Math.sin( time2 * 0.3 + (0.5 * i)) * 2400;
	luces[i].position.y = Math.cos( time2 * 0.4 + (0.5*i)) * 2500-800;
	luces[i].position.z = Math.sin( time2 * 0.2 + (0.5 * i)) * 2400-200 + 4000;
    }
    
    cube.rotation.x += 0.04;
    cube.rotation.y += 0.023;

    // cube.position.x = keypoints[0][0] * 0.005; 

    text.position.x = keypoints[0][0]* 0.05;
    text.position.y = keypoints[0][1]* 0.05 -35;
    text.position.z = keypoints[0][2] * 0.1;

    cube.position.x = keypoints[0][0]* 0.05- 40;
    cube.position.y = keypoints[0][1]* 0.05 -10;
    cube.position.z = keypoints[0][2] * 0.1;
    
    //torus.rotation.x += 0.01;
    // torus.rotation.y += 0.02;
  			      
    for(let i = 0; i < NUM_KEYPOINTS; i++){
	cubos[i].position.x = keypoints[i][0] * 0.05-20; 
	cubos[i].position.y = keypoints[i][1] * 0.05-20; 
	cubos[i].position.z = keypoints[i][2] * 0.05;
	cubos[i].rotation.z += 0.005;
	cubos[i].rotation.y += 0.0111;
	// cubos[i].rotation.x += (degree*2 ) * Math.sin( time2 * 0.2 ) * 0.001 + (i * 0.0002); // aqui le quite lo de la transformación de degree 
	// cubos[i].rotation.y += 0.002;
    }

    if( degree < 0 ){
	degree = degree - Math.PI ;
    }
    
    text.rotation.y = degree * 2 + Math.PI   ;

    for(var i = 0; i < 5; i++){
	torus[i].rotation.y += 0.001 + (i * 0.0005); 
	torus[i].rotation.x += (degree * 2 + Math.PI) * (i+1) * 0.001; 
	torus[i].rotation.z += 0.001 + (i * 0.0006);
    }

    // Si no hay rostros no dibujes nada, si hay rostros dibuja la cantidad de rostros que haya 

    stats.update(); 
    renderer.render( scene, camera );
    
};

async function sonido(){

    // variables
    
    let wet = [0.1, 0.2, 0, 0.04];
    let wetActual;
    
    let reverse = [true, false, false, true, false];
    let reverseActual;
    let reverseCambio = 0; 

    let pitch = [0, -12, 0, -12, 12];
    let pitchActual;
    let pitchCambio = 0; 

    let start = [0.1, 0.5 ,0.7, 0.3, 0.9];
    let startActual;
    let startCambio = 0; 

    let cambioC = 0;

    // Generadores de audio
    
    await Tone.start();
    const reverb = new Tone.JCReverb(0.5).toDestination();
    const pitchShift = new Tone.PitchShift().connect(reverb);
    const dist = new Tone.Distortion(0.2).connect(pitchShift);
    const player = new Tone.GrainPlayer({
	url: "https://tonejs.github.io/audio/drum-samples/breakbeat.mp3",
	loopStart: 0.5,
	loopEnd: 1.0, 
	detune: 0.2, 
	grainSize: 0.1,
	overlap: 0.5,
	playbackRate: 1, 
	reverse: true,
	loop: true,
	volume: 0.25
    }).connect(dist);

    Tone.loaded().then(() => {
	player.start();
    });

    // secuencias 

    
    setInterval(function(){
	let al = Math.floor(Math.random()*5);
	//console.log(al); 
	pitchActual= pitch[al]; 
	pitchCambio++;
	pitchShift.pitch = pitchActual; 
	wetActual = wet[al]; 
	reverb.wet = wetActual;
    }, 300);

    setInterval(function(){
	let al = Math.floor(Math.random()*5)
	reverseActual= reverse[al]; 
	reverseCambio++;
	player.reverse = reverseActual; 
	scene.background = colores[al] ;
	cambioC++; 
    },300);

    setInterval(function(){
	startActual= start[startCambio%5]; 
	startCambio++;
	player.loopStart = startActual;
    }, 600);

  
    
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();    
    renderer.setSize( window.innerWidth, window.innerHeight );
}


async function detonar(){
    await renderPrediction(); 
    animate();
    // oscSend();
    sonido(); 
}

video = document.getElementById( 'video' );
const texture = new THREE.VideoTexture( video );

//texture.wrapS = THREE.RepeatWrapping;
//texture.repeat.x = - 1;
//texture.rotation.y = Math.PI / 2; 


/// Para osc, queda pendiente la activación 

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
