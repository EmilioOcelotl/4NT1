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

// Keypoints de la cara 

let clight1, clight2, clight3, clight4; 

let scene, camera, renderer, material, cube, geometryPoints; 
let geometryC, materialC; 
let cubos = [];
let grupo; 

const NUM_KEYPOINTS = 468; // 468
// const NUM_IRIS_KEYPOINTS = 5; // Sin iris

//const GREEN = '#32EEDB';
//const RED = "#FF2C35";
//const BLUE = "#157AB3";

// Para optimizar en teléfonos 

// let keypoints;
let points = [];
let normals = [];
let keypoints = new Float32Array;  
// var points = new Float32Array;
let pointcloud; 

let geometry = new THREE.BufferGeometry();
let mesh =  new THREE.Mesh(); 

function isMobile() {
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isiOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  return isAndroid || isiOS;
}

function distance(a, b) {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}

// La función que dibuja
// Pointcloud tiene la información necesaria 

/*

function drawPath(ctx, points, closePath) { 
  const region = new Path2D(); // Este es el objeto que plotea los puntos.  
  region.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    region.lineTo(point[0], point[1]);
  }

  if (closePath) {
    region.closePath();
  }
  ctx.stroke(region);
}

*/ 

let model, ctx, videoWidth, videoHeight, video, canvas;

const VIDEO_SIZE = 800;
const mobile = isMobile();
// Don't render the point cloud on mobile in order to maximize performance and
// to avoid crowding limited screen space.
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

// Extraer predicciones pero no dibujarlas con scatterGL, pasar los puntos como puntos de open 

async function renderPrediction() {
  // stats.begin();

    // parece que todo biene de predictions 
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
		    // normals.push( 0, 0, 1 );
 

		    // geometry.computeVertexNormals();

		    
		    // necesitamos los points 
		    //drawPath(ctx, points, true); // aquí se dibuja el mesh triangulado
		    // console.log(points); 
		    
		}
	    //}
	});
    }

  // stats.end();
    // rafID = requestAnimationFrame(renderPrediction);
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

    // scene.background = new THREE.Color( 0xf0f0f0 ); // UPDATED

    
    renderer = new THREE.WebGLRenderer();
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

    geometryC = new THREE.SphereGeometry( 0.75, 2, 2 );

    // geometryC = new THREE.BoxGeometry(0.7, 0.7, 0.7);
    //materialC = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    // materialC = THREE.MeshPhongMaterial( { color: 0xdddddd, specular: 0x009900, shininess: 30, map: texture, transparent: true } ) ;

    let materialC = new THREE.MeshStandardMaterial( {
	color: 0xffffff,
	// envMap: scene.background,
	// refractionRatio: 0.75
	roughness: 0.2,
	metalness: 0.4
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
	cubos[i].scale.x = 0.1 + (Math.random()*2); 
	cubos[i].scale.y = 0.1 + (Math.random()*2); 
	cubos[i].scale.z = 0.1 + (Math.random()*2); 
		
	scene.add( cubos[i] );
    }


    camera.position.z = 20;
    camera.rotation.z = Math.PI; 
    
    // scene.add( cube); 

    //cubos.geometry.computeBoundingBox();
    //cubos.geometry.verticesNeedUpdate = true;
    
    // renderPrediction();
    animate(); 
    //console.log(points[0]); 
}

async function animate () {

    var time2 = Date.now() * 0.0005;
    
    requestAnimationFrame( animate );
    
    await console.log(keypoints[12][0]);

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
	cubos[i].position.x = keypoints[i][0] * 0.05-25; 
	cubos[i].position.y = keypoints[i][1] * 0.05-20; 
	cubos[i].position.z = keypoints[i][2] * 0.05;
	// cubos[i].rotation.z = Math.PI / 2; 
    }
    
    renderer.render( scene, camera );
};

init(); 
//animate();
