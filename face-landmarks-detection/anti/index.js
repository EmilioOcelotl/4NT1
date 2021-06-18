
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection'
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl'; 
import '@tensorflow/tfjs-backend-cpu';
import * as THREE from 'three';

import {TRIANGULATION} from './triangulation'; // Qué es esto 

import * as Tone from 'tone'; 

const OSC = require('osc-js'); // pal osc 
const osc = new OSC(); 
// const osc = new OSC({ plugin: new OSC.WebsocketServerPlugin() })

let clight1, clight2, clight3, clight4; 

let scene, camera, renderer, material, cube, geometryPoints; 
let geometryC, materialC; 
let cubos = [];
let grupo; 
let font; 
let text = new THREE.Mesh(); 

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

const VIDEO_SIZE = 500;
// const renderPointcloud = mobile === false;
// const synth = new Tone.Synth().toDestination();


const startButton = document.getElementById( 'startButton' );
startButton.addEventListener( 'click', init  );

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
	    // Only setting the video to a specified size in order to accommodate a
	    // point cloud, so on mobile devices accept the default size.
	  
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

    /*
    const blocker = document.getElementById( 'blocker' );
    const instructions = document.getElementById( 'instructions' );
    instructions.remove(); 
    blocker.remove();
    */
    
    await Tone.start();
    console.log('tamos redy');
    
    // falta que init inicie otra cosa que luego inicie render y animate
    // animate podría estarr en render 
    
    await tf.setBackend('webgl'); 
    await setupCamera();
    video.play(); 

    videoWidth = video.videoWidth;
    videoHeight = video.videoHeight;
    video.width = videoWidth;
    video.height = videoHeight;

    model = await faceLandmarksDetection.load(
	faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
	{maxFaces: 1}); // número de caras 

    // renderPrediction();

    // detonar(); 

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    
    let rojo = new THREE.Color( 0xaf43be );
    let verde = new THREE.Color( 0xfd8090 ); 
    let azul = new THREE.Color( 0xc4ffff); 
    let morado = new THREE.Color( 0x08deea ); 
    let blanco = new THREE.Color ( 0xffffff); 

    clight1 = new THREE.PointLight(rojo, 0.4)
    clight2 = new THREE.PointLight(verde, 0.4)
    clight3 = new THREE.PointLight(azul, 0.4)
    clight4 = new THREE.PointLight(morado, 0.4)

    scene.add( clight1 )
    scene.add( clight2 )
    scene.add( clight3 )
    scene.add( clight4 )

    const geometryVideo = new THREE.PlaneGeometry( 50, 50 );
    const materialVideo = new THREE.MeshBasicMaterial( {color: 0xffffff, map:texture, side: THREE.DoubleSide} );
    const planeVideo = new THREE.Mesh( geometryVideo, materialVideo );
    planeVideo.rotation.x = Math.PI;
    planeVideo.position.z = -10; 
    scene.add( planeVideo );
    
    geometryC = new THREE.SphereGeometry( 0.75, 2, 2 );

   
    let materialC = new THREE.MeshStandardMaterial( {
	color: 0xffffff,
	// map: texture, 
	// refractionRatio: 0.75
	roughness: 0.1,
	metalness: 0.9,
	//opacity: 0.25,
	// transparent: true,
	side: THREE.DoubleSide
    } );
    
    cube = new THREE.Mesh( geometryC, materialC );
    // aqui me quedé ya están los puntos solamente hace falta plotearlos 

    grupo = new THREE.Group();

    for(let i = 0; i < NUM_KEYPOINTS; i++){
	cubos[i] = new THREE.Mesh(geometryC, materialC);
	cubos[i].rotation.x = Math.random() * Math.PI ;
	cubos[i].rotation.y = Math.random() * Math.PI ; 
	cubos[i].rotation.z = Math.random() * Math.PI ;
	cubos[i].scale.x = Math.random() * 4.0;
	cubos[i].scale.y = Math.random() * 2.0; 
	cubos[i].scale.z = Math.random() * 2.0; 
	scene.add( cubos[i] );
    }
    								      
    camera.position.z = 40;
    camera.rotation.z = Math.PI; 
    	
    var fontLoader = new THREE.FontLoader();

    fontLoader.load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_regular.typeface.json", function(font ){ 

	let mFont  = new THREE.MeshStandardMaterial( {
	    color: 0xffffff,
	    // msap: texture, 
	    // refractionRatio: 0.75
	    roughness: 0.4,
	    metalness: 0.9,

	side: THREE.DoubleSide
	
    } );

	const message = "4nti";
	//const shapes = font.generateShapes( message, 6 );
	
	//const geometry = new THREE.ShapeGeometry( shapes );

	
	textGeo = new THREE.TextGeometry( message, {

	    font: font,
	    
	    size: 10,
	    height: 1,
	    curveSegments: 4,
	    
	    bevelThickness: 1,
	    bevelSize: 0.2,
	    bevelEnabled: true
	    
	} );

	textGeo.computeBoundingBox();

	xMid = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

	textGeo.translate( xMid, 0, 0 );

	// make shape ( N.B. edge view not visible )
	
	text = new THREE.Mesh( textGeo, mFont );
	// text.position.z =  1;
	text.rotation.z = Math.PI;	
	scene.add( text );

    })
    
    renderer = new THREE.WebGLRenderer({alpha:true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize );

    detonar(); 
    // await animate();
  
}


async function oscSend(){

    osc.open();

    // Creo que cada mitad tiene 16 menos uno 15 - 30 puntos en total  
    // 76 - 93 sin 79
    // 310 - 327 sin 323 

    // keypoints en x
    
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

async function animate () {

    var time2 = Date.now() * 0.0005;
    
    requestAnimationFrame( animate );
    
    // await console.log(keypoints[12][0]);

    clight1.position.x = Math.sin( time2 * 0.4 ) * 1400;
    clight1.position.y = Math.cos( time2 * 0.3 ) * 50;
    clight1.position.z = Math.cos( time2 * 0.2 ) * 1400;
	
    clight2.position.x = Math.cos( time2 * 0.2 ) * 1400;
    clight2.position.y = Math.sin( time2 * 0.3 ) * 50;
    clight2.position.z = Math.sin( time2 * 0.4 ) * 1400;
	
    clight3.position.x = Math.cos( time2 * 0.4 ) * 1400;
    clight3.position.y = Math.cos( time2 * 0.2 ) * 50;
    clight3.position.z = Math.sin( time2 * 0.3 ) * 1400;
	
    clight4.position.x = Math.sin( time2 * 0.3 ) * 1400;
    clight4.position.y = Math.cos( time2 * 0.4 ) * 50;
    clight4.position.z = Math.sin( time2 * 0.2 ) * 1400;
    
    // geometry.normalsNeedUpdate = true;
    // renderPrediction(); 
    
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    // cube.position.x = keypoints[0][0] * 0.005; 

    text.position.x = keypoints[0][0]* 0.05;
    text.position.y = keypoints[0][1]* 0.05 -35;
    text.position.z = keypoints[0][2] * 0.1;

    if( degree < 0 ){
	degree = degree - Math.PI ;
    }
    
    text.rotation.y = degree * 2 + Math.PI   ;

    // console.log( degree ); 
			      
    for(let i = 0; i < NUM_KEYPOINTS; i++){
	cubos[i].position.x = keypoints[i][0] * 0.05-20; 
	cubos[i].position.y = keypoints[i][1] * 0.05-20; 
	cubos[i].position.z = keypoints[i][2] * 0.05;
	cubos[i].rotation.z = Math.PI / 2;
	cubos[i].rotation.x += 0.01; 
    }

    renderer.render( scene, camera );
    
};

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();    
    renderer.setSize( window.innerWidth, window.innerHeight );

}


async function detonar(){

    await renderPrediction(); 
    // render preduction y esperar
    animate();
    oscSend(); 
    // oscSend 

}


video = document.getElementById( 'video' );
const texture = new THREE.VideoTexture( video );

// init();


//texture.wrapS = THREE.RepeatWrapping;
//texture.repeat.x = - 1;
//texture.rotation.y = Math.PI / 2; 
//animate();
