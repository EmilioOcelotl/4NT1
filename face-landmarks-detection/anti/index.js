/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

// Librerías 

import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection'
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl'; 
import '@tensorflow/tfjs-backend-cpu';
import * as THREE from 'three';

import {TRIANGULATION} from './triangulation'; // Qué es esto 

const OSC = require('osc-js'); // pal osc 
const osc = new OSC(); 
// const osc = new OSC({ plugin: new OSC.WebsocketServerPlugin() })

let clight1, clight2, clight3, clight4; 

let scene, camera, renderer, material, cube, geometryPoints; 
let geometryC, materialC; 
let cubos = [];
let grupo; 

const NUM_KEYPOINTS = 468; // 468

let points = [];
let normals = [];
let keypoints = new Float32Array;  
let pointcloud; 

let geometry = new THREE.BufferGeometry();
let mesh =  new THREE.Mesh(); 

// const client = new Client('127.0.0.1', 3333); // para enviar 

function isMobile() {
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isiOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  return isAndroid || isiOS;
}

let model, ctx, videoWidth, videoHeight, video;

const VIDEO_SIZE = 800;
const mobile = isMobile();

const renderPointcloud = mobile === false;

async function setupCamera() {
    video = document.getElementById('video');
    
    const stream = await navigator.mediaDevices.getUserMedia({
	'audio': false,
	'video': {
	    facingMode: 'user',
	    // Only setting the video to a specified size in order to accommodate a
	    // point cloud, so on mobile devices accept the default size.
	    width: mobile ? undefined : VIDEO_SIZE,
	    height: mobile ? undefined : VIDEO_SIZE
	},
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
    
  // ctx.drawImage(
  //     video, 0, 0, 800, 800, 0, 0, 800, canvas.height); // dibuja el video 

    if (predictions.length > 0) {
	predictions.forEach(prediction => {
	    keypoints = prediction.scaledMesh; // estos son los puntos que necesito. Parece que es un arreglo 

	    //if (state.triangulateMesh) {
		//ctx.strokeStyle = GREEN;
		// ctx.lineWidth = 0.5;

		for (let i = 0; i < TRIANGULATION.length / 3; i++) {

		    points = [
			TRIANGULATION[i * 3], TRIANGULATION[i * 3 + 1],
			TRIANGULATION[i * 3 + 2]
		    ].map(index => keypoints[index]); //parece que los points, ya estan escalados ?

		    //drawPath(ctx, points, true); // aquí se dibuja el mesh triangulado
		    
		}
	    
	});
    }

    

       
    requestAnimationFrame(renderPrediction);
    
};

async function init() {

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
    renderPrediction();

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    //const video = document.getElementById( 'video' );
    //const texture = new THREE.VideoTexture( video );

    // scene.background = texture; 
    // scene.background = new THREE.Color( 0xf0f0f0 ); // UPDATED
    
    renderer = new THREE.WebGLRenderer({alpha:true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

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
	metalness: 0.9
    } );
  
    cube = new THREE.Mesh( geometryC, materialC );
    // aqui me quedé ya están los puntos solamente hace falta plotearlos 

    grupo = new THREE.Group();

    let escala; 

    for(let i = 0; i < NUM_KEYPOINTS; i++){
	cubos[i] = new THREE.Mesh(geometryC, materialC);
	cubos[i].rotation.x = Math.random() * Math.PI ;
	cubos[i].rotation.y = Math.random() * Math.PI ; 
	cubos[i].rotation.z = Math.random() * Math.PI ; 

	escala = Math.random()* 1.5;
	cubos[i].scale.x = 0.5 + (Math.random()*5); 
	cubos[i].scale.y = 0.5 + (Math.random()*0.5); 
	cubos[i].scale.z = 0.5 + (Math.random()*0.5); 
		
	scene.add( cubos[i] );
    }


    camera.position.z = 40;
    camera.rotation.z = Math.PI; 
    
    // scene.add( cube); 

    //cubos.geometry.computeBoundingBox();
    //cubos.geometry.verticesNeedUpdate = true;
    
    // renderPrediction();
    animate(); 
    //console.log(points[0]);

    /*
    osc.open();
    
    osc.on('open', () => {
	const message = new OSC.Message('/test', 12.221, 'hello')
	osc.send(message)
    })
    */    

//    var message = new OSC.Message('/test', Math.random());
//     osc.send(message);

    /*
    osc.open();
    
    setInterval(() => 
    osc.on('open', () => {
	const message = new OSC.Message('/keypoints0' )
	
	for (let i = 0; i < NUM_KEYPOINTS; i = i + 40){
	    
	    message.add( new Float32Array(keypoints) );
	    
	    }
	
	osc.send(message)
    }), 100);
    */ 

    
    
}

async function oscSend(){

    osc.open();

    // keypoints en x
    
    osc.on('open', () => {

	setInterval(function(){
	    const message = new OSC.Message('/kpx');
	    for (let i = 0; i < NUM_KEYPOINTS; i++){
		message.add( keypoints[i][0] );	
	    }
	    osc.send(message);
	}, 1000);
    })

    // keypoints en y 

    osc.on('open', () => {
	setInterval(function(){
	    const message = new OSC.Message('/kpy');
	    for (let i = 0; i < NUM_KEYPOINTS; i++){
		message.add( keypoints[i][1] );	
	    }
	    osc.send(message);
	}, 1000);
    })

    // keypoints en z 

    osc.on('open', () => {
	setInterval(function(){
	    const message = new OSC.Message('/kpz');
	    for (let i = 0; i < NUM_KEYPOINTS; i++){
		message.add( keypoints[i][2] );
	    }
	    osc.send(message);
	}, 1000);
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

    for(let i = 0; i < NUM_KEYPOINTS; i++){
	cubos[i].position.x = keypoints[i][0] * 0.05-20; 
	cubos[i].position.y = keypoints[i][1] * 0.05-20; 
	cubos[i].position.z = keypoints[i][2] * 0.05;
	// cubos[i].rotation.z = Math.PI / 2;
	cubos[i].rotation.x += 0.05; 
    }
    
    renderer.render( scene, camera );
};

init();
oscSend(); 

// Pasar lo siguiente a un objeto que se posicione exactamente al centro y que tenga 800 x 800

video = document.getElementById( 'video' );
const texture = new THREE.VideoTexture( video );

//texture.wrapS = THREE.RepeatWrapping;
//texture.repeat.x = - 1;
//texture.rotation.y = Math.PI / 2; 
//animate();
