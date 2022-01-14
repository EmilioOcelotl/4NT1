/////////////////////////////////
// ///////// 4NT1 /////////////////
// ////////////////////////////////

// Alternar escenas sencillas
// Mensaje en caso de que no alcance a leer una cámara
// Mensajes de vulnerabilidad 

import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as THREE from 'three';
import {TRIANGULATION} from './js/triangulation';
import * as Tone from 'tone';
import Stats from 'stats.js';
// import {Reflector} from '/Reflector.js'; // lo movi a js
import {EffectComposer} from './jsm/postprocessing/EffectComposer.js';
import {RenderPass} from './jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from './jsm/postprocessing/UnrealBloomPass.js';
import {GlitchPass} from './jsm/postprocessing/GlitchPass.js';
import {TTFLoader} from './jsm/loaders/TTFLoader.js';
// import perlinNoise3d from 'perlin-noise-3d';
// const perlinNoise3d = require('perlin-noise-3d');
import {AfterimagePass} from './jsm/postprocessing/AfterimagePass.js';
// import * as blazeface from '@tensorflow-models/blazeface';
import {ImprovedNoise} from './jsm/math/ImprovedNoise.js';
import { GUI } from './jsm/libs/dat.gui.module.js';

import { OBJLoader } from './jsm/loaders/OBJLoader.js';


//import Delaunator from 'delaunator';

//import '@tensorflow-models/facemesh';
//import '@tensorflow-models/blazeface';

///////////////////// Variables importantes

let boolText = true; 

/////////////////////

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

let cambioC = 0;

// let pitchShift, reverb, dist;
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
    textureSize = 1024 * dpr;
    console.log('Estático');
}

let texture;
const vector = new THREE.Vector2();
// let cuboGrande;
let afterimagePass, bloomPass; 
let porcentaje;

// let noise = new perlinNoise3d();
let noiseStep = 0;
let vueltas;

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

let inicioCreditos; 
let finCreditos, transCreditos = 0;
let segundoCreditos; 

const perlin = new ImprovedNoise();
let intro; 
let gSegundo; 

const line = new Tone.Player('audio/fondos/line.mp3').toDestination(); 
antiKick = new Tone.Player('audio/perc/antiKick.mp3').toDestination();
const respawn = new Tone.Player('audio/perc/respawn.mp3').toDestination(); 
const out = new Tone.Player('audio/perc/out.mp3').toDestination(); 
intro = new Tone.Player('audio/fondos/espera.mp3').toDestination();
intro.loop = true; 

intro.volume.value = -6;

const outline = new Tone.Player('audio/fondos/outline.mp3').toDestination(); 

/*
const panner = new Tone.Panner3D({
	panningModel: 'HRTF',
    });

*/
const distortion = new Tone.Distortion(0.5);

const pitchShift = new Tone.PitchShift().connect(distortion);
pitchShift.pitch = -3; // down one octave
pitchShift.windowSize = 0.03; // down one octave

const mic = new Tone.UserMedia(2);

//.connect( toneFFT );

let openmic; 

mic.open().then(() => {
    openmic = true;
    mic.connect( pitchShift ); 
});

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

let matPoints = []; 
let matPoints2 = [];

let clock;

let creditos = false; 
let antifont; 

// Puedo usar los textos como arreglo
// Algunos mensajes son comunes, otros no

// 1. La ofuscación como motivo 

let txtsc1 = [
    "Predicciones y presencias",
    "Una oportunidad\npara el desplazamiento",
    "Como una inmersión\ninformada",
    "La sugestión\nde los anzuelos\nen la superficie",
    "la búsqueda por un espacio alejado\na la geopolítica del servidor", 
    "Pasos [pequeños, inestables]\nhacia la ofuscación\n[analógica, digital]",
    "La reinterpretación\nde la [predicción, tecnología]",
    "Predicciones y presencias",
    "Pixeles desorganizados\nque enmascaran la presencia",
    "Interrupción de flujos\nno autorizados",
    "El software\ncomo una caja negra\nde cajas negras",
    "La ofuscación integrada\ny conducida por la [auto]gestión\ndel dato",
    "Sin descuidar\nla importancia del gesto",
    "Continúa\nel tríptico es breve",
    "Predicciones y presencias",
    "La ofuscación\nes un motivo de apertura",
    "El efecto\nes distracción y evidencia",
    "La inexactitud de las máquinas\nla retroalimentación humana",
    "El flujo\nes un ciclo con variaciones",
    "Una oportunidad\npara cuidar la presencia",
    "La disensión fluída\nde la identidad",
    "Triangulaciones\nde la resistencia",
    "Vertices geométricos\n que difuminan la presencia\n pero no la eliminan",
    "Los QR son referencias\npara desbordar\nel momento", 
    "Si necesitas más tiempo\npuedes dar otra vuelta",
    "Interlocuciones modulares",
    "El reflejo\nde los espejos electrónicos",
    "Consecuencias\nde las transfiguraciones corporales",
    "La percepción analítica\nde las imágenes que no es solamente técnica",
    "Autobservación, percepción y encarnación\nde modos y espectativas",
    "Predicciones y presencias",
    "[Inclusión, Exclusión]\nen la escalada de recursos tecnológicos",
    "Restar agencia a las plataformas digitales",
    "Manuales para la ofuscación",
    "Servidores de audio\ncomo Jack\npara transformar la voz",
    "La disulución del ego",
    "La descentralización\nde la persona\nen la vida cotidiana"
];

// 2. Las consecuencias no buscadas del rodeo

let txtsc2 = [    
    "Predicciones y presencias",
    "El texto como un dipositivo multihilo",
    "La infraestructura como una instancia\ndel trabajo invertido",
    "Las posilidades del tríptico",
    "[Ejecución, variación]\nde la reflexión fijada",
    "Instancias no escritas dele conocimiento",
    "La emergencia del comentario",
    "Un parpadeo largo\npara concluir",
    "¿Es redundante\nvincular un espacio fisico\ncon el entramado digital?",
    "Vertices geométricos\n que difuminan la presencia\n pero no la eliminan",
    "Los QR son referencias\npara desbordar\nel momento",
    "Predicciones y presencias",
    "Si necesitas más tiempo\npuedes dar otra vuelta",
    "La [escritura, ejecución]\nde código como improvisación",
    "Ña agencia del error\nen la práctica performática\nde escribir",
    "[Audio, Imagen]\ncomo instancias de conocimiento",
    "La subjetividad de los ciclos por segundo",
    "¿Qué tanto es un 1mb de texto plano?",
    "Código y reflexión\nen relación\na una escritura automática",
    "La persecución de premisas históricas",
    "Espejos o interlocutores",
    "La estructura tecnológica\nes condición para la estructura",
    "La revelación\ndel resultado inesperado\ndel procesamiento",
    "Tiempo insuficiente\npara extender la reflexión extendida",
    "Una federación\n de iniciativas\npara decentralizar lo sensible",
    "La escala de tiempo\npara escapar a la\nreflexión instantánea",
    "1mb de texto plano\npara iniciar\nel díalogo dislocado del tiempo",
    "Tiempo",
    "Predicciones y presencias",
    "Temporalidades que se disocian\npero que a veces coinciden",
    "anti es  un manual",
    "una aplicación que se inserta\nen un conjunto de módulos",
    "Un motivo para la reflexión" 
]; 

// Instrucciones compartidas para todas las escenas - manual 
// Visibilizar el manual en modo exhibición 

let txtsc3 =[
    "Anti es un manual de ofuscación",
    "Anti es un manual de ofuscación",
    "Anti es un manual de ofuscación",
    "Anti corre en modo exhibición",
    "Anti se ejecuta en modo cotidiano",
    "El modo exhibición se activa en el navegador",
    "Es necesario\ncomplementar con la localidad",
    "El desplazamiento\nde los dispositivos\npara aprovechar\nposibilidades",
    "Los ajustes de la interfaz de usuarix",
    "¿Cómo visibilizar el modo exhibición en el manual?",
    "OBS Studio\nes la forma más fácil\nde transmitir video\ncomo una cámara web virtual.",
    "Opciones ligeras que solamente pueden ejecutarse en linux",
    "El rodeo y la necedad\ncomo un aporte\npara el futuro", 
    "v4l2loopback y Ffmpeg",
    "modprobe v4l2loopback",
    "modprobe v4l2loopback",
    "modprobe v4l2loopback",
    "ffmpeg -f x11grab -r 20 -s 1920x1080\n-i :0.0+0,0 -vcodec rawvideo\n-pix_fmt yuv420p -threads 0 -f v4l2 /dev/video0",
    "ffmpeg -f x11grab -r 20 -s 1920x1080\n-i :0.0+0,0 -vcodec rawvideo\n-pix_fmt yuv420p -threads 0 -f v4l2 /dev/video0",
    "ffmpeg -f x11grab -r 20 -s 1920x1080\n-i :0.0+0,0 -vcodec rawvideo\n-pix_fmt yuv420p -threads 0 -f v4l2 /dev/video0",
    "Rota\nno hay un centro neutral",
    

]

/*
let txtPrueba = [

    "Presencia de predicciones", 
    "Los comentarios pueden repartirse\ncomo indicaciones y\n como programacion",
    "Una buena parte del trabajo invertido\nse concentra en la\ndelimitacion escenica",
    "Otra parte del trabajo invertido\n esta en la infraestructura",
    "El análisis de datos\n como una posibilidad\n de interacción",
    "Es necesario algún otro dispositivo\nde interaccion para acceder\na enlaces externos",
    "¿Es redundante\nvincular un espacio fisico\ncon el entramado digital?",
// # qr con la referencia a la reflexión de documenta 
    "El cubrebocas funciona\ncomo un dispositivo de ofuscacion facial\npor sí mismo",
    "Dos tipos de ofuscacion:\nsonora y visual",
    "¿La distancia temporal\nestá asociada al contexto?",
    "Implicaciones de predecir\n[presencia, ausencia]",
    "La importancia del gesto",
    "si te quedas,\nlas escenas continuan",
    "Falta 1 MB de texto plano\npara el siguiente proyecto",
    "Continúa",
    "Ningún dato\n queda almacenado",
    "La ofuscación\n es un motivo\n de apertura",
    "Si estás en un espacio cerrado\nsal",
    "Si estás en un espacio cerrado\nlas escenas continúan",
    "¿Necesitas más tiempo?",
    "En cada vuelta\n hay una variación\ndistinta",
    "Una oportunidad\n para cuidar la presencia",
    "Vertices geométricos\n que difuminan la presencia\n pero no la eliminan",
    "¿Qué hay\n detrás de la máscara?",
    "Triangulaciones",
    "El efecto es distracción y evidencia"
];

*/

let txtInstrucciones = [

    "En espera",
    "Ausencia y predicciones", 
    "La pantalla de bloqueo\nse activa cuando la cámara\n detecta uno o más rostros",
    "Por favor,\nacércate para activar la interacción.\nPueden participar hasta tres personas", 
    "Es necesario un rostro\n dentro del rango de la cámara", 
    "Será necesario que te quites el cubrebocas\n y mantengas 1.5 m de distancia", 
    "Es posible acceder\na la versión web de esta aplicación",
    "También hay un repositorio\nque conduce a los módulos\nque conforman esta aplicación",
    "Ausencia y predicciones"
    // qr del repo 
    
]

// formas menos ñoñas de hacer referencia al descanso 

let txtDescanso = [
    "descansa",
    "cierra los ojos",
    "difuminate",
    "un par de segundos",
    "cierra los ojos",
    "no hay limite de tiempo",
]
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
    "15": "audio/fondos/15.mp3"
}).toDestination();

fondos.volume.value = -6;

let perlinValue;
let perlinAmp;
let cuboGBool = false;
let loopOf, loopRod, loopTxt, loopDescanso; 

// Textos generales 

loopOf = new Tone.Loop((time) => {
   
    if(boolText){
	chtexto(
	    txtsc1[Math.floor(Math.random()*txtsc1.length)],
	    txtsc1[Math.floor(Math.random()*txtsc1.length)],
	    Math.random()*20 - 10,
	    Math.random()*40 - 20,
	    Math.random()*20 - 10,
	    Math.random()*40 - 20
	);
    }

    let fondosAl = Math.floor(Math.random()*14);
    fondos.player(fondosAl.toString()).start(time);
        
}, "5");

loopRod = new Tone.Loop((time) => {
   
    if(boolText){
	chtexto(
	    txtsc2[Math.floor(Math.random()*txtsc2.length)],
	    txtsc2[Math.floor(Math.random()*txtsc2.length)],
	    Math.random()*20 - 10,
	    Math.random()*40 - 20,
	    Math.random()*20 - 10,
	    Math.random()*40 - 10
	);
    }

    let fondosAl = Math.floor(Math.random()*14);
    fondos.player(fondosAl.toString()).start(time);
        
}, "5");

// Instrucciones 

loopTxt = new Tone.Loop((time) => {

    if(boolText){
	chtexto(
	    txtInstrucciones[Math.floor(Math.random()*txtInstrucciones.length)],
	    txtInstrucciones[Math.floor(Math.random()*txtInstrucciones.length)],
	    Math.random()*40 - 20,
	    Math.random()*40  -20,
	    Math.random()*40 - 20,
	    Math.random()*40 - 20
	);
    }
	
}, "10");

// Descanso 

loopDescanso = new Tone.Loop((time) => {
    
    if(boolText){
	chtexto(
	    txtDescanso[Math.floor(Math.random()*txtDescanso.length)],
	    txtDescanso[Math.floor(Math.random()*txtDescanso.length)],
	    Math.random()*20 - 0,
	    Math.random()*40 - 30,
	    Math.random()*20 - 0,
	    Math.random()*40 - 30
	); 
    }
    
}, "5");

Tone.Transport.start();

let blinkRate;
let blinked = false;
let tempBlinkRate = 0;
let rendering = true;
let rateInterval;
const EAR_THRESHOLD = 0.27;

let blinkConta = 0;

let txtPos1 = [], txtPos2 = []; 
let txtPosCopy1 = [], txtPosCopy2 = []; 
let textCopy1, textCopy2; 

let cuboGrandeOrg;

let camWidth, camHeight; 
let wCor, hCor;
let camSz; 

let gometryVideo; 
let vidGeometry; 
let planeVideoOrg;

let exBool = true;
// let cotiBool = false; 
let escenasFolder = []; 
let objEsc1, objEsc2; 

var params = {
    opacidad: 0.5,
    damp: 0.5,
    tamaño: 4,
    perlin: 0.01, 
    rojo: 255,
    verde: 0,
    azul: 255,
    texto: true,
    retro: true, 
    sonido: true, 
    voz: false,
    grano: 0.01,
    altura: 0
}

let videoFolder = []; 
let audioFolder = []; 


    let keyactualX = [];
    let keyanteriorX = [];

    let keyactualY = [];
    let keyanteriorY = [];
    let velsX = [], velsY = [], vels = [];


let avg;

let velarriba, velabajo, velizquierda, velderecha; 

let object;
let modelBool;

let trigeom = new THREE.BufferGeometry();

let trimesh = new THREE.Mesh(); 

let triPosiciones = [];
let triCantidad = 440; // probar con 100, luego 880  
let triGeometry = [];
let triangulos = []; 

let trimaterial = new THREE.MeshBasicMaterial( { color: 0xffaa00, side: THREE.DoubleSide } ); 

for(let i = 0; i < 3; i++){

    const x = Math.random() * 200 - 100;
    const y = Math.random() * 200 - 100;
    const z = Math.random() * 200 - 100;

    triPosiciones.push(x, y, z); 
    
}

// console.log(triPosiciones); 

for(let i = 0; i < triCantidad; i++){

    triGeometry[i] = new THREE.BufferGeometry();
    triGeometry[i].setAttribute( 'position', new THREE.Float32BufferAttribute( triPosiciones, 3 ) );
    triGeometry[i].usage = THREE.DynamicDrawUsage; 
    triangulos[i] = new THREE.Mesh( triGeometry[i], trimaterial  );

}

////////////////////////////////////////////////////////////////////////////////////////////////

// /////////// Setupear la cámara

async function setupCamera() {

    if(navigator.userAgent.match(/firefox|fxios/i)){

	// console.log("es firefox");
	camWidth = 640;
	camHeight = 480;
	
	wCor = (33);
	hCor = 28;

	if(!mobile){
	    camSz = 7;
	} else {
	    camSz = 10; 
	}
	
    } else {

	camWidth = 640;
	camHeight = 480;

	//wCor = (33-(33/4));
	//hCor = 28+(28/4);

	wCor = 33;
	hCor = 28
	
	if(!mobile){
	    camSz = 9;
	} else {
	    camSz = 10; 
	}
	
    }
    
    video = document.getElementById('video');
    stream = await navigator.mediaDevices.getUserMedia({
	// 'audio': false,
	'video': {
	    facingMode: 'user',
	  
	    // width: camWidth, // antes 640
	    // height: camHeight,

	    width: mobile ? undefined : camWidth,
	    height: mobile ? undefined : camHeight,
	    
	    // frameRate: {ideal: 20, max: 60},
	}
    });
    
    video.srcObject = stream;
    let {width, height} = stream.getTracks()[0].getSettings();
    console.log('Resolución:'+ `${width}x${height}`); // 640x480
    return new Promise((resolve) => {
	video.onloadedmetadata = () => {
	    resolve(video);
	    initBlinkRateCalculator();
	   		
	};
    });
}

async function renderPrediction() {

    if( buscando && exBool ){
	fin = Date.now();
	transcurso = (fin - inicio) / 1000;
    } 

    if(buscando && creditos){
	finCreditos = Date.now();
	transCreditos = ( finCreditos - inicioCreditos) / 1000; 
    }
    
    // score(transcurso, 10);

    score();
    
    predictions = await model.estimateFaces({
	input: video,
	returnTensors: false,
	flipHorizontal: false,
	predictIrises: irises,
    });

    // y si ya paso cierto tiempo entonces reinicia 
    
    if (prueba != predictions.length ) {
	initsc0();
    }

    // console.log(transcurso); 

    prueba = predictions.length;
    // materialVideo.needsUpdate = true;
    let arre = [];
    
    vueltas = 0;

    for(let i = 0; i < triCantidad; i++){
	triGeometry[i].attributes.position.needsUpdate = true;
    }
    
    if (predictions.length > 0) {

	predictions.forEach((prediction) => {
	    keypoints = prediction.scaledMesh;

	    for (let i = 0; i < TRIANGULATION.length / 3; i++) {
		points = [
		    TRIANGULATION[i * 3], TRIANGULATION[i * 3 + 1],
		    TRIANGULATION[i * 3 + 2],
		].map((index) => keypoints[index]);

		arre.push(points); 	
	    }

	    arre = arre.flat(2);

	    let triconta = 0;
	    
	    for(let j = 0; j < triCantidad; j++){
		for(let i = 0; i < 3; i++){
		    triGeometry[j].attributes.position.setX( i, arre[triconta*3] * 0.1 -wCor); 
		    triGeometry[j].attributes.position.setY( i, arre[(triconta*3)+1] * 0.1 - hCor );
		    triGeometry[j].attributes.position.setZ( i, arre[(triconta*3)+2] * 0.05 );
		    triconta++; 
		}
	    }

	   

	    


	    // aquí tendría que haber más animsc hay que probar 
	    
	    if (buscando) {
		switch ( escena ) {
		case 0: // 0 - titulo 1
		    animsc1();
		    break;
		case 1: // 1 - escena 1
		    animsc1();
		    break;
		case 2: // 2 - titulo 2
		    animsc1();
		    break;
		case 3: // 3 - escena 2
		    animsc2();
		    break;
		case 4: // 4 - titulo 3
		    //animIrises();
		    break;
		case 5: // 5 - escena 5
		    animIrises();
		    break; 
		    // animCreditos(); 
		case 6: // 6 - Creditos 
		    animCreditos();
		    break; 
		case 7: // epilogo  
		    break;
		case 8: // reinicio
		    break; 
		}
	    }

	    //// parpadeo

	    if(irises){
		
		let lowerRight = prediction.annotations.rightEyeUpper0;
		let upperRight = prediction.annotations.rightEyeLower0;
		const rightEAR = getEAR(upperRight, lowerRight);
	    
		let lowerLeft = prediction.annotations.leftEyeUpper0;
		let upperLeft = prediction.annotations.leftEyeLower0;
		const leftEAR = getEAR(upperLeft, lowerLeft);
		
		let blinked = leftEAR <= EAR_THRESHOLD && rightEAR <= EAR_THRESHOLD;
		if (blinked) {
		    updateBlinkRate();
		}

		if( getIsVoluntaryBlink(blinked) ){
		    // console.log(prediction.annotations.rightEyeUpper0); 
		    // console.log("parpadeo");
		    //blinkSignal = Date.now(); 
		    // aquí hay que agregar un contador. Si pasa cierto número de tiempo entonces miau
		    blinkConta++;

		    console.log(blinkConta); 

		    //if(blinkConta == 50){
			//console.log("ojos cerrados o muchos parpadeos"); 
		    //} 
		    
		} else {
		    blinkConta = 0; 

		// blinkConta = 0; 
		
	    // console.log(getIsVoluntaryBlink(blinked)); 
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

       // texto anclado al movimiento de la cara
       
	//text.position.x = keypoints[0][0]* 0.1 -35 + txtPosX;
	//text.position.y = keypoints[0][1]* 0.1 -30 + txtPosY;
	//text.position.z = keypoints[0][2] * 0.1 + 10;

	//text2.position.x = keypoints[0][0]* 0.1 -35 + txtPosX2;
	//text2.position.y = keypoints[0][1]* 0.1 -30 + txtPosY2;
	//text2.position.z = keypoints[0][2] * 0.1 + 10;
	
    } else {
	
	text.position.x = txtPosX;
	text.position.y = txtPosY;
	
	text2.position.x = txtPosX2;
	text2.position.y = txtPosY2;
	
	//text.position.z = 0;
	
    }
    
    // panner.positionX.value = degree *2; // degree reducido
    //console.log(degree * 4);
    
    cuboGrande.rotation.x += 0.002;
    cuboGrande.rotation.y += (degree/4) * 0.01;
    ///text.rotation.y = degree * 2 + (Math.PI );
    //text2.rotation.y = degree * 2 + (Math.PI );

    //mouseX = ( keypoints[168][0] - windowHalfX ) / 10;
    //mouseY = ( keypoints[168][1] - windowHalfY ) / 10;

    // /console.log( Math.abs(mouseX) - 32, );

    //camera.position.x += ( Math.abs(mouseX)- 36 - camera.position.x ) * .05;
    // camera.position.y += ( Math.abs(mouseY)- 24 - camera.position.y ) * .05;

    camera.lookAt( scene.position );
    camera.rotation.z = Math.PI;
    // stats.update();
    renderer.render( scene, camera );
 
    // console.log(degree); 
    vertices = [];
    composer.render();
  
    if(cuboGBool || suspendido ){
	
	vector.x = ( window.innerWidth * dpr / 2 ) - ( textureSize / 2 );
	vector.y = ( window.innerHeight * dpr / 2 ) - ( textureSize / 2 );
	
	renderer.copyFramebufferToTexture( vector, texture );
    }

    /*
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
    */

    /// texto movimiento

    let delta, time; 

    if(!mobile || cuboGBool){
	delta = clock.getDelta();
	time = clock.getElapsedTime() * 10;
	var time2 = Date.now() * 0.0005;
    }

    if(!mobile){

	// const position = geometry.attributes.position;

	text.geometry.attributes.position.needsUpdate = true;
	
	for ( let i = 0; i < text.geometry.attributes.position.count; i ++ ) {
	    // let d = perlin.noise(txtPos1[i] * 0.001 +time  );
	    
	let d = perlin.noise(
	    text.geometry.attributes.position.getX(i) * 0.04+ time2,
	    text.geometry.attributes.position.getY(i) * 0.04 + time2,
	    text.geometry.attributes.position.getZ(i) * 0.04+ time2) *  0.25; 
	    
	    //const y = 0.5 * Math.sin( i / 5 + ( time + i ) / 7 );
	    
	    //text.geometry.attributes.position.setX( i, textCopy1.geometry.attributes.position.getX(i) + d );
	    //text.geometry.attributes.position.setY( i, textCopy1.geometry.attributes.position.getY(i) + d );
	    text.geometry.attributes.position.setZ( i, textCopy1.geometry.attributes.position.getZ(i) + d );
	    // txtPos1.setX( i, txtPos1init.attributes.position.x); 
	}

	text2.geometry.attributes.position.needsUpdate = true;
	
	for ( let i = 0; i < text2.geometry.attributes.position.count; i ++ ) {

	let d = perlin.noise(
	    text2.geometry.attributes.position.getX(i) * 0.04+ time2,
	    text2.geometry.attributes.position.getY(i) * 0.04 + time2,
	    text2.geometry.attributes.position.getZ(i) * 0.04+ time2) *  0.25; 
	    
	    //const y = 0.5 * Math.sin( i / 5 + ( time + i ) / 7 );
	    
	    //text2.geometry.attributes.position.setX( i, textCopy2.geometry.attributes.position.getX(i) + d );
	    //text2.geometry.attributes.position.setY( i, textCopy2.geometry.attributes.position.getY(i) + d );
	    text2.geometry.attributes.position.setZ( i, textCopy2.geometry.attributes.position.getZ(i) + d );
	    
	}
    }
    
	if(cuboGBool){
	    const algo = cuboGrande.geometry.attributes.position;
	    
	    algo.needsUpdate = true;
	    // algoOrg.needsUpdate = true; 
	    
	    for ( let i = 0; i < algo.count; i ++ ) {

		let d = perlin.noise(
		    algo.getX(i) * 0.01+ time2,
		    algo.getY(i) * 0.01 + time2,
		    algo.getZ(i) * 0.01 + time2) *  0.25; 

		// let d = perlin.noise(txtPos1[i] * 0.001 +time  ); 
		const z = 0.5 * Math.sin( i / 1 + ( time + i ) / 5 );
		const x = 0.5 * Math.sin( i / 1 + ( time + i ) / 5 );
		const y = 0.5 * Math.sin( i / 1 + ( time + i ) / 5 );
		
		algo.setZ( i,  cuboGrandeOrg.geometry.attributes.position.getZ(i) + d );
		algo.setX( i,  cuboGrandeOrg.geometry.attributes.position.getX(i) + d );
		algo.setY( i,  cuboGrandeOrg.geometry.attributes.position.getY(i) + d ); 
		// txtPos1.setX( i, txtPos1init.attributes.position.x); 
	    }
	}

    // console.log(exBool);

    for(let i = 0; i < keypoints.length; i++){

	keyanteriorX[i] = keyactualX[i];
	keyactualX[i] = keypoints[i][0];
	velsX[i] = Math.abs(keyanteriorX[i] - keyactualX[i]);
	
	keyanteriorY[i] = keyactualY[i];
	keyactualY[i] = keypoints[i][1];
	velsY[i] = Math.abs(keyanteriorY[i] - keyactualY[i]);

	vels[i] = (velsX[i] + velsY[i]) / 2;
	// aqui va el promedio de velocidades por punto 
	
    }

    /*
    const sumX = velsX.reduce((a, b) => a + b, 0);
    const avgX = (sumX / velsX.length) || 0;

    const sumY = velsY.reduce((a, b) => a + b, 0);
    const avgY = (sumY / velsY.length) || 0;
    */
    
    const sum = vels.reduce((a, b) => a + b, 0);
    const avg = (sum / vels.length) || 0;

   
    // arriba 10
    // abajo 152
    // izq 234
    // der 454
    
    // promedio de las velocidades de todos los puntos
    // promedios dependiendo de puntos específicos
    
    //console.log( avg ); // Promedio general 

    requestAnimationFrame(renderPrediction);
    // console.log(params.opacidad); 
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
    container = document.createElement( 'div' );
    document.body.appendChild( container );
    document.body.style.cursor = 'none'; 
    loaderHTML.style.display = 'block';

    await setupCamera();
    
    video.play(); 

    // Esto tiene que ver con que no se pueda usar el modo retrato 

    videoWidth = video.videoWidth;
    videoHeight = video.videoHeight;
    video.width = videoWidth;
    video.height = videoHeight;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    camera.position.z = 40;
    camera.rotation.z = Math.PI;
    
    clock = new THREE.Clock();
    cols(); // quitar ? 

    // let {width, height} = stream.getTracks()[0].getSettings();
    // console.log('Resolución:'+ `${width}x${height}`); // 640x480

    const geometryVideo = new THREE.PlaneGeometry( camWidth/7, camHeight /7, 16, 16); // Dos modalidades, abierta y ajustada para cel
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
    
    // guiFunc(); 
    
    
    // afterimagePass.uniforms['damp'].value = 0.85;

	// videoFolder.open(); 
    
    retro();
    materiales();
						       
    sprite = new THREE.TextureLoader().load( 'img/part.png' );
    sprite2 = new THREE.TextureLoader().load( 'img/spark1.png' );
						       
    for(let i = 0; i < 3; i++){
    
	matPoints[i] = new THREE.PointsMaterial( {
	    color: colores[Math.floor(Math.random()*4)],
	    size: 4,
	    map: sprite,
	    blending: THREE.AdditiveBlending,
	    // rotation: 0.1; 
	    //transparent: true,
	    //opacity: 0.75,
	    // sizeAttenuation: false,
	    alphaTest: 0.9,
	    // depthTest: false
	} );

	matPoints2[i] = new THREE.PointsMaterial( {
	    color: 0x000000,
	    size: 2,
	    // map: sprite,
	    blending: THREE.AdditiveBlending,
	    // transparent: true,
	    //opacity: 0.5,
	    // sizeAttenuation: false,
	    alphaTest: 0.9,
	    // depthTest: false
	} );

	
    }

    planeB = [new THREE.Points( pGeometry[0], matPoints[0] ), new THREE.Points( pGeometry[1], matPoints[1] ), new THREE.Points( pGeometry[2], matPoints[2] )];
   
    for (var i = 0; i < 3; i++) {
	pGeometry[i].verticesNeedUpdate = true;
    }

    geometryB = new THREE.BufferGeometry();
    geometryB.verticesNeedUpdate = true;
   
    let audioSphere = new THREE.BoxGeometry( 400, 400, 400, 32, 32, 32 );
    cuboGrande = new THREE.Mesh(audioSphere, materialC2 );
    cuboGrandeOrg = new THREE.Mesh(audioSphere, materialC2 );

    texto();

    loadFont(); 
    
    renderer = new THREE.WebGLRenderer({antialias: true});

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    /*
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = Math.pow(2, 4.0 );
    */
    
    document.body.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize );

    // container.appendChild( stats.dom );

    const renderScene = new RenderPass( scene, camera );

    bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    composer = new EffectComposer( renderer );
    composer.addPass( renderScene );
    composer.addPass( bloomPass );
    afterimagePass = new AfterimagePass();
    composer.addPass( afterimagePass );
    afterimagePass.uniforms['damp'].value = 0.85;
    // glitchPass = new GlitchPass();
    // composer.addPass( glitchPass );

    model = await faceLandmarksDetection.load(
	faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
	{maxFaces: 1,
	 shouldLoadIrisModel: true, // Hay que cargar un poco más de archivos 
	 // maxContinuousChecks: 120
	});

    for(let i = 0; i < triCantidad; i++){
	scene.add(triangulos[i]);
	triangulos[i].position.z = 1;
	triangulos[i].rotation.y = Math.PI*2;
    }
    
    detonar();
    
}

function initsc0() {

    loopDescanso.stop(); 
    
    cuboGrande.rotation.x = 0;
    cuboGrande.rotation.y = 0;

    if ( predictions.length < 1 ) {

	outline.stop(0);
	line.stop(0); 
	loopTxt.start(0); 
	loopRod.stop(0);
	loopOf.stop(0); 
	out.start(); // out.loop? 
	scene.add(planeVideo); 
	planeVideo.material.opacity = 1; 
	materialVideo.map = new THREE.TextureLoader().load( 'img/siluetaNeg.png' );
	materialVideo.map.wrapS = THREE.RepeatWrapping;
	materialVideo.map.repeat.x = - 1;

	text.material.color = new THREE.Color(0xffffff); 
	planeVideo.geometry.dispose();
	const geometryVideoNew = new THREE.PlaneGeometry( 480/15, 640/15 ); // Dos modalidades, abierta y ajustada para cel

	planeVideo.geometry = geometryVideoNew; 
	// materialVideo.map.rotation.y = Math.PI / 2; // por alguna razon hay que comentar esto 
	
	rmsc1();
	rmsc2();
	rmIrises(); 
	
	modoOscuro = true;

	if(boolText){
    	    chtexto(
		txtsc1[Math.floor(Math.random()*txtsc1.length)],
		txtsc1[Math.floor(Math.random()*txtsc1.length)],
		Math.random()*40 - 20,
		Math.random()*40 - 20,
		Math.random()*40 - 20,
		Math.random()*40 - 20
	    );
	}
	
	buscando = false;
	scene.remove( cuboGrande );

	intro.restart(); // que se detone hasta que la libería esté cargada 
	// intro.start();

	bloomPass.threshold = 0.7;
	bloomPass.strength = 0.5;
	bloomPass.radius = 0;

    } else {

	loopTxt.stop(0); 
	planeVideo.geometry.dispose();
	const geometryVideoNew = new THREE.PlaneGeometry( camWidth/camSz, camHeight/camSz ); // Dos modalidades, abierta y ajustada para cel

	planeVideo.geometry = geometryVideoNew; 
	materialVideo.map = new THREE.VideoTexture( video );
	respawn.start(); 

	escena = 0;

	if(exBool){
	    titulo1();
	} else {
	    if(escena == 1){
		initsc1(); 
	    }
	    if(escena == 3){
		initsc2(); 
	    }
	}

	transcurso = 0; 
	inicio = Date.now();
	segundo = 0;
 
	modoOscuro = false;

	/*
	if(boolText){
    	    chtexto(
		txtPrueba[Math.floor(Math.random()*txtPrueba.length)],
		txtPrueba[Math.floor(Math.random()*txtPrueba.length)],
		Math.random()*40 - 20,
		Math.random()*40 - 20,
		Math.random()*40 - 20,
		Math.random()*40 - 20
	    );
	}
	*/
	
	buscando = true;
	// scene.add( cuboGrande );
	scene.add( text );
	scene.add( text2 );
	// Tone.Destination.mute = false; 
	intro.stop();

    }
}

function titulo1(){

    outline.stop(0);
    line.stop(0); 
    console.log("titulo 1 "); 
    loopTxt.stop(0); 
    
    if(boolText){
	chtexto(
	    "I\nLa ofuscación como motivo",
	    "",
	    0,
	    0,
	    0,
	    0
	);
    }

    cuboGrande.rotation.x = 0;
    cuboGrande.rotation.y = 0;
    cuboGrande.rotation.z = 0; 
    
    scene.remove( planeVideo );
    scene.remove( cuboGrande ); 
    text.material.color = new THREE.Color(0xffffff); 
    cuboGBool = false;

   
    if (predictions.length > 0) {
	for (let i = 0; i < planeB.length; i++) {
	    scene.remove( planeB[i] );
	}
    }
    
    let cuentaPlane = 0;
   
    if (predictions.length > 0) {
	predictions.forEach((prediction) => {
	     planeB[cuentaPlane].material = matPoints[Math.floor(Math.random()*3)]; 
	    scene.add( planeB[cuentaPlane] );
	    cuentaPlane++;
	});
    }

    
}

function initsc1() {

    cuboGBool = true; 
    loopOf.start(0);
    line.stop();
    outline.stop(); 

    // text.material.blending = THREE.AdditiveBlending; 
    // text2.material.blending = THREE.AdditiveBlending; 

    text.material.color = new THREE.Color(0xffffff ); 
    
    // cuboGBool = true; 
    // respawn.start(); // otro sonido que no sea respawn 

    irises = false;
    
    cuboGBool = true; 
    afterimagePass.uniforms['damp'].value = 0.85;

    bloomPass.threshold = 0.95;
    bloomPass.strength = 0;
    bloomPass.radius = 0;

    perlinValue = 0.03;
    perlinAmp = 4;
    
    //matPoints.map= sprite;
    //matPoints.size=6; 
    // planeB[0].material = matPoints; 

    scene.add( planeVideo);

    planeVideo.material.opacity = 0; 
    // scene.remove( planeVideo ); 
    scene.add(cuboGrande); 
    scene.add(planeVideo); 
    
    if(boolText){
	chtexto(
	    txtsc1[Math.floor(Math.random()*txtsc1.length)],
	    txtsc1[Math.floor(Math.random()*txtsc1.length)],
	    Math.random()*40 - 20,
	    Math.random()*40 - 20,
	    Math.random()*40 - 20,
	    Math.random()*40 - 20
	);
    }
	
    if (predictions.length > 0) {
	for (let i = 0; i < planeB.length; i++) {
	    scene.remove( planeB[i] );
	}
    }

    let cuentaPlane = 0;

   
    if (predictions.length > 0) {
	predictions.forEach((prediction) => {
	    planeB[0].material = matPoints[Math.floor(Math.random()*3)]; 
	    scene.add( planeB[cuentaPlane] );
	    cuentaPlane++;
	});
    }
    
   
}

// dos correcciones de acuerdo a la resolución. Pienso que esto tiene que ver con el modo horizontal o vertical. Cada navegador hace lo que quiere y firefox nunca me deja jalar la cámara en módo vertical 

function animsc1() { 

    if(exBool){
	perlinValue = 0.003+(transcurso/60*0.003); 
	planeVideo.material.opacity = transcurso/60 +0.1; 
    }
    
    var time2 = Date.now() * 0.0005;

    for ( let i = 0; i < position[vueltas].count; i ++ ) {

	// Blet d = perlin.noise(keypoints[i][0] * 0.003  + time2, keypoints[i][1]*0.003+time2, keypoints[i][2]* 0.003+time2) * 4; 

	let d = perlin.noise(
	    keypoints[i][0] * perlinValue + time2,
	    keypoints[i][1] * perlinValue + time2,
	    keypoints[i][2] * perlinValue + time2) *  1; 

	// let d = 0;
	
	// const analisis = Tone.dbToGain ( analyser.getValue()[i%64] ) * 20;
	position[vueltas].setX( i, (1+keypoints[i][0] * 0.1 - wCor) * (1+d) ); 
	position[vueltas].setY( i, (1+keypoints[i][1] * 0.1 - hCor) * (1+d) ); // aquí está raro 
	position[vueltas].setZ( i, keypoints[i][2] * 0.05  );
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

function titulo2(){

    loopOf.stop(0);
    loopTxt.stop(0); 
    line.start(0); 
    if(boolText){
	chtexto(
	    "II\nLas consecuencias\nno buscadas del rodeo",
	    "",
	    0,
	    0,
	    0,
	    0
	);
    }

    scene.remove( cuboGrande ); 
    scene.remove( planeVideo ); 
    text.material.color = new THREE.Color(0xffffff); 
    cuboGBool = false; 
    
}

// Escena 2

function initsc2() {

    cuboGBool = true; 
    loopRod.start(0); 
    // line.start(0); 
    // loop.start(0); 
    
    text.material.color = new THREE.Color(0xffffff); 

    scene.add( planeVideo);
    scene.add( cuboGrande ); 
    /*
    if(!mobile){
	gSignal = Date.now();
	composer.addPass( glitchPass );
	glitchPass.goWild = true;
    }
    */ 
    
    // planeVideo.material.opacity = 0.5; 
    cuboGBool = true; 
    // respawn.start();

    afterimagePass.uniforms['damp'].value = 0.85;

    bloomPass.threshold = 0.95;
    bloomPass.strength = 0;
    bloomPass.radius = 0;

    // matPoints.color = new THREE.Color(0x000000); 
    // matPoints.map.dispose(); 
    //matPoints.map= sprite;
    for(let i = 0; i < 3; i++){	
	matPoints[i].size= 8;
    }
    perlinValue = 0.003;
    perlinAmp = 2;

    // matPoints.blending = THREE.AdditiveBlending;
    text.material.blending = THREE.AdditiveBlending; 
    text2.material.blending = THREE.AdditiveBlending; 

    // text.material.color = new THREE.Color(0x000000); 
    
    cuboGrande.material.opacity = 0; 
    scene.add(cuboGrande); 
    // planeVideo.material.opacity = 0; 
    // scene.add( planeVideo);

    if(boolText){
	chtexto(
	    txtsc1[Math.floor(Math.random()*txtsc1.length)],
	    txtsc1[Math.floor(Math.random()*txtsc1.length)],
	    Math.random()*40 - 20,
	    Math.random()*40 - 20,
	    Math.random()*40 - 20,
	    Math.random()*40 - 20
	);
    }
	
    if (predictions.length > 0) {
	for (let i = 0; i < planeB.length; i++) {
	    scene.remove( planeB[i] );
	}
    }

    let cuentaPlane = 0;

    if (predictions.length > 0) {
	predictions.forEach((prediction) => {
	    planeB[0].material = matPoints2[Math.floor(Math.random()*3)]; 
	    scene.add( planeB[cuentaPlane] );
	    cuentaPlane++;
	});
    }
}

// dos correcciones de acuerdo a la resolución. Pienso que esto tiene que ver con el modo horizontal o vertical. Cada navegador hace lo que quiere y firefox nunca me deja jalar la cámara en módo vertical 

function animsc2() {

    if(exBool){
	perlinValue = 0.03-((transcurso-60)/60*0.03); 
	planeVideo.material.opacity = 1 - (transcurso-60)/60; 
    }
    
    // console.log((transcurso-40)/40); 
    // cuboGrande.material.opacity = (transcurso-40)/40; 
    
    var time2 = Date.now() * 0.0005;

    for ( let i = 0; i < position[vueltas].count; i ++ ) {

	// Blet d = perlin.noise(keypoints[i][0] * 0.003  + time2, keypoints[i][1]*0.003+time2, keypoints[i][2]* 0.003+time2) * 4; 

	let d = perlin.noise(keypoints[i][0] * perlinValue + time2,
			     keypoints[i][1] * perlinValue + time2,
			     keypoints[i][2] * perlinValue + time2) *  0.5; 

	// let d = 0;
	
	// const analisis = Tone.dbToGain ( analyser.getValue()[i%64] ) * 20;
	position[vueltas].setX( i, (1+keypoints[i][0] * 0.1 - wCor) * (1+d) ); // antes 1+analisis
	position[vueltas].setY( i, (1+keypoints[i][1] * 0.1 - hCor) * (1+d) );
	position[vueltas].setZ( i, keypoints[i][2] * 0.05  );
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


function titulo3(){

    loopOf.stop(0);
    loopRod.stop(0); 
    loopTxt.stop(0);     
    outline.start();

    if(boolText){
	chtexto(
	    "III\nCompromiso y escritura",
	    "",
	    0,
	    0,
	    0,
	    0
	);
    }

    scene.remove( cuboGrande ); 
    scene.remove( planeVideo ); 
    text.material.color = new THREE.Color(0xffffff); 
    cuboGBool = false; 
    
}


// Podría ser que hasta aquí haya más texto que en las escenas anteriores 

function initIrises(){

    cuboGBool = false; 

    // outline.start();
    
    text2.material.blending = THREE.AdditiveBlending; 
    text.material.color = new THREE.Color(0xE4E6EB); 
    text.material.blending = THREE.NoBlending;
    text2.material.blending = THREE.NoBlending; 

    if(boolText){
	chtexto(
	    txtDescanso[Math.floor(Math.random()*txtDescanso.length)],
	    txtDescanso[Math.floor(Math.random()*txtDescanso.length)],
	    Math.random()*40 - 20,
	    Math.random()*40 - 20,
	    Math.random()*40 - 20,
	    Math.random()*40 - 20
	);
    }
    
    irises = true;
    scene.remove(planeVideo);
    scene.remove(cuboGrande);
    loopTxt.stop(0);
    loopRod.stop(0);
    loopOf.stop(0); 

    loopDescanso.start(0); 
    
}

function animIrises(){
    
    // console.log("hay alguien ahí?");
    if(blinkConta == 50){
	console.log("creditos");
	creditos = true;
	escena = 6;
	inicioCreditos = Date.now();
	// nuevo contador 
    } 

}

function rmIrises(){
    irises = false; 
}

function initCreditos(){
}

function animCreditos(){
}

function rmCreditos(){
} 

function initEpilogo(){
}

function reinicio(){
}

// Ajustar duraciones

///////////////////////////////////////////////7
//// IMPORTANTE: ¿Con esto es necesario activar/desactivar con initsc0? Sip
//// iMPORTANTE2: ¿Podría hacerse con los secuenciadores de tone.js ? No se sabe
///////////////////////////////////////////////

function score() {

    /*

      1. titulo1   000 - 005 s
      2. initsc1   005 - 065 s
      3. titulo2   065 - 070 s
      4. initsc2   070 - 130 s
      5. titulo3   130 - 135 s
      6. irises    135 - x s
      7. epilogo  x   - x + 30 s 
 
     */
    
    if(buscando){
	
	if ( transcurso.toFixed() == 5 && segundo != 5 ) {
	    console.log("Primera Escena"); 
	    segundo = transcurso.toFixed();
	    // aquí puede ir algo asociado a las predicciones 
	    modoOscuro = false; 
	    escena = 1;
	    rmsc1();
	    rmsc2();
	    rmIrises(); 
	    initsc1();
	    
	}

	// titulo 2

	if ( transcurso.toFixed() == 65 && segundo != 65 ) {
	    console.log("Título 2");
	    segundo = transcurso.toFixed();
	    escena = 2; 
	    rmsc1();
	    rmsc2();
	    rmIrises();
	    titulo2(); 
	    
	}
	
    // Por defecto inicia en la primer escena 
    
	if ( transcurso.toFixed() == 70 && segundo != 70 ) {
	    console.log("Segunda Escena"); 
	    segundo = transcurso.toFixed();
	    // aquí puede ir algo asociado a las predicciones 
	    modoOscuro = false; 
	    escena = 3;
	    rmsc1();
	    rmsc2();
	    initsc2();
	    
	}

	if ( transcurso.toFixed() == 125 && segundo != 125 ) {
	    console.log("Título 3");
	    segundo = transcurso.toFixed();
	    escena = 4; 
	    rmsc1();
	    rmsc2();
	    rmIrises();
	    titulo3(); 
	}
	
	if ( transcurso.toFixed() == 130 && segundo != 130 ) {
	    console.log("Tercera Escena"); 
	    segundo = transcurso.toFixed();
	    modoOscuro = true;
	    irises = true; 
	    escena = 5;
	    rmsc1();
	    rmsc2();
	    initIrises();	    
	}

	if ( transcurso.toFixed() == 160 && segundo != 160 ) {
	    console.log("Epilogo"); 
	    segundo = transcurso.toFixed();
	    // modoOscuro = true; 
	    escena = 7;
	    rmsc1();
	    rmsc2();
	    rmIrises();	    
	}

	// Si paso ese tiempo y no parpadearon entonces reinicia
	
	if ( transcurso.toFixed() == 165 && segundo != 165 && !creditos ) {
	    console.log("Reinicio"); 
	    segundo = transcurso.toFixed();
	    // modoOscuro = true; 
	    escena = 8;
	    rmsc1();
	    rmsc2();
	    rmIrises();
	    // initsc1();
	    transcurso = 0;
	    inicio = Date.now();
	    // fin = 0; 
	}

	// Creditos 

	if( transCreditos.toFixed() == 5 && segundoCreditos != 5 ){
	    segundoCreditos = transCreditos.toFixed(); 
	    initCreditos();
	    escena = 6; 
	}

	if( transCreditos.toFixed() == 30 && segundoCreditos != 30 ){
	    segundoCreditos = transCreditos.toFixed(); 
	    console.log("Epilogo Creditos "); 
	    escena = 7;
	    rmCreditos();
	    creditos = false; 
	}

	if( transCreditos.toFixed() == 35 && segundoCreditos != 35 ){
	    segundoCreditos = transCreditos.toFixed();
	    console.log("Reinicio créditos");
	    escena = 8;
	    transcurso = 0;
	    transCreditos = 0; 
	}
	
    }
}

function guiFunc(){

        //  nuevo gui 

    const gui = new GUI();

    const modosFolder = gui.addFolder('Modos');
   escenasFolder = gui.addFolder('Escenas'); 
    
    var audioGUI = {
	vozAjena: true,
	audio: true,
	vozPropia: false, 
    }

    var videoGUI = {
	texto: true,
	retro: true,
	
    }
    
    //modosFolder.add(options, 'exhibición').onChange( modoEx ); 
    // modosFolder.add(options, 'cotidiano' ).onChange( modoCot ); 

    var obj = { clicExhibición:modoEx };
    modosFolder.add(obj,'clicExhibición');

    var obj2 = { clicUsoCotidiano:modoCot };
    modosFolder.add(obj2,'clicUsoCotidiano');

    modosFolder.open(); 

    objEsc1 = { escena_1:cotEscena1 };
    escenasFolder.add(objEsc1, 'escena_1');
        
    objEsc2 = { escena_2:cotEscena2 };
    escenasFolder.add(objEsc2, 'escena_2'); 

    videoFolder = gui.addFolder('Video');
    
    videoFolder.add(params, 'opacidad', 0, 1, 0.001).onChange(function(){
	planeVideo.material.opacity = params.opacidad; 
    })

    videoFolder.add(params, 'damp', 0, 1, 0.001).onChange(function(){
	afterimagePass.uniforms['damp'].value = params.damp; 
    })

    videoFolder.add(params, 'tamaño',  1, 50).onChange(function(){
	for(let i = 0; i < 3; i++){
	    matPoints[i].size = params.tamaño; 
	}
    })

    videoFolder.add(params, 'perlin',  0.001, 0.05, 0.001).onChange(function(){
	perlinValue = params.perlin; 
    })

    videoFolder.add(params, 'retro',  true).onChange(function(){
	cuboGBool = params.retro;
	if(cuboGBool){
	    scene.add(cuboGrande);
	} else {
	    scene.remove(cuboGrande); 
	}
    })

    
    videoFolder.add(params, 'rojo',  0, 1, 0.01).onChange(function(){
	const nuevoColor = new THREE.Color(params.rojo, params.verde, params.azul);
	for(let i = 0; i < 3; i++){
	    matPoints[i].color = nuevoColor; 
	}
    })

    videoFolder.add(params, 'verde',  0, 1, 0.01).onChange(function(){
	const nuevoColor = new THREE.Color(params.rojo, params.verde, params.azul);
	for(let i = 0; i < 3; i++){
	    matPoints[i].color = nuevoColor; 
	}
    })

    videoFolder.add(params, 'azul',  0, 1, 0.01).onChange(function(){
	const nuevoColor = new THREE.Color(params.rojo, params.verde, params.azul);
	for(let i = 0; i < 3; i++){
	    matPoints[i].color = nuevoColor; 
	}
    })

    videoFolder.add(params, 'texto', true).onChange(function(){
	boolText = params.texto; 
	if(boolText){
	    scene.add(text);
	    scene.add(text2); 
	} else {
	    scene.remove(text);
	    scene.remove(text2); 
	}
    })

    audioFolder = gui.addFolder('Audio');

    audioFolder.add(params, 'sonido',  true).onChange(function(){
	const audioBool = params.sonido; 
	if(audioBool){
	    fondos.mute = false; 
	} else {
	    fondos.mute = true; 
	}
    })
    
    audioFolder.add(params, 'voz',  true).onChange(function(){
	if(params.voz){
	    distortion.toDestination(); 
	} else {
	    distortion.disconnect(); 
	}
    })
    
    audioFolder.add(params, 'grano',  0.001, 0.1, 0.001).onChange(function(){
	pitchShift.windowSize = params.grano; 
    })

    audioFolder.add(params, 'altura',  -24, 24, 1).onChange(function(){
	pitchShift.pitch = params.altura; 
    })

}

function texto() {

    if(boolText){
	const color = 0xffffff;
	
	const matLite = new THREE.MeshBasicMaterial( {
	    color: 0x404040,
	    // transparent: true,
	    // opacity: 0.8,
	    side: THREE.DoubleSide,
	    // blending: THREE.AdditiveBlending,
	    // transparent: true,
	} );

    const loader1 = new THREE.FontLoader();

    loader1.load( 'fonts/techno.json', function( font ) {

	const message = "";
	const shapes = font.generateShapes( message, 1);
	const geometry = new THREE.ShapeGeometry( shapes );
	geometry.computeBoundingBox();

	const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
 	geometry.translate( xMid, 0, 0 );
	text = new THREE.Mesh( geometry, matLite );
	text.position.z = 5;
	// text.rotation.x = Math.PI;
	// text.rotation.y =q Math.PI;
	text.rotation.z = Math.PI;
	scene.add( text );

	text2 = new THREE.Mesh( geometry, matLite );
	text2.position.z = 5;
	// text.rotation.x = Math.PI;
	// text.rotation.y = Math.PI;
	text2.rotation.z = Math.PI;
	scene.add( text2 );
	
    });
    }
	
}

function chtexto( mensaje, mensaje2, posX,  posY, posX2, posY2 ) {

    /*
    if(!mobile){
	gSignal = Date.now();
	composer.addPass( glitchPass );
	glitchPass.goWild = true;
    }
   */ 

    //const loader1 = new THREE.FontLoader();
 
    //loader1.load( 'fonts/techno.json', function( font ) {
	
	txtPosX = posX;
	txtPosY = posY;	
	txtPosX2 = posX2;
	txtPosY2 = posY2;
	
	const message = mensaje; 
	const shapes = antifont.generateShapes( message, 1 );
	const geometry = new THREE.ShapeGeometry( shapes );
	geometry.computeBoundingBox();
	const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
	geometry.translate( xMid, 0, 0 );
	text.geometry.dispose(); 
	text.geometry= geometry;
	text.material.dispose();

    text.position.x = txtPosX; 
    text.position.y = txtPosY;
    text.position.z = 10;
    
    const message2 = mensaje2; 
    const shapes2 = antifont.generateShapes( message2, 1 );
    const geometry2 = new THREE.ShapeGeometry( shapes2 );
    geometry2.computeBoundingBox();
    const xMid2 = - 0.5 * ( geometry2.boundingBox.max.x - geometry2.boundingBox.min.x );
    geometry2.translate( xMid2, 0, 0 );
    text2.geometry.dispose(); 
    text2.geometry= geometry2;
    text2.material.dispose();
    
    text2.position.x = txtPosX2; 
    text2.position.y = txtPosY2;
    text2.position.z = 10;

    
	if(!mobile){

	    //text2Copy = geometry.attributes.position;
	    text.geometry.usage = THREE.DynamicDrawUsage;
	    //txtPosCopy1 = txtPos1.clone(); 
	    textCopy1 = text.clone(); 

	    
	    // txtPos2 = geometry2.attributes.position;
	    text2.geometry.usage = THREE.DynamicDrawUsage;
	    textCopy2 = text2.clone(); 
	    // txtPosCopy2 = txtPos2.clone(); 
	    
	// }

	}
}

function retro() {
    const data = new Uint8Array( textureSize * textureSize * 3 );
    texture = new THREE.DataTexture( data, textureSize, textureSize, THREE.RGBFormat );
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

async function detonar() {
    await renderPrediction();
    // sonido();
    guiFunc(); 
    loaderHTML.style.display = 'none';

    console.log('██╗  ██╗███╗   ██╗████████╗ ██╗\n██║  ██║████╗  ██║╚══██╔══╝███║\n███████║██╔██╗ ██║   ██║   ╚██║\n╚════██║██║╚██╗██║   ██║    ██║\n     ██║██║ ╚████║   ██║    ██║\n     ╚═╝╚═╝  ╚═══╝   ╚═╝    ╚═╝'); // fps();
    inicio = Date.now();
    respawn.start(); 
}

function cols() {
    colores = [new THREE.Color( 0x59181E ),
	       new THREE.Color( 0x5C1452 ),
	       new THREE.Color( 0x45195C ),
	       new THREE.Color( 0x25145C ),
	       new THREE.Color( 0x000000 )];
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
	// transparent: true,
	// color: diffuseColor,
	// reflectivity: beta,
	// envMap: alpha < 0.5 ? reflectionCube : null
    } );

}

function modoEx(){
    exBool = true;
    transcurso  = 0; 
    initsc0(); 
    escenasFolder.close();
    videoFolder.close();
    audioFolder.close(); 
}

function modoCot(){
    exBool = false;
    transcurso = 0;
    escenasFolder.open();
    videoFolder.open();
    audioFolder.open(); 
    // initsc0();
    // options['exhibicion']= false; 
}

function cotEscena1(){

    modoOscuro = false; 
    escena = 1;
    rmsc1();
    rmsc2();
    rmIrises(); 
    initsc1();

}

function cotEscena2(){
    //console.log("Segunda Escena"); 
    // segundo = transcurso.toFixed();
    // aquí puede ir algo asociado a las predicciones 
    modoOscuro = false; 
    escena = 3;
    rmsc1();
    rmsc2();
    initsc2();
    //transcurso = 0; 
}


//////////////////////////////////////
//////////////////// PARPADEO
//////////////////////////////////////


function initBlinkRateCalculator() {
  rateInterval = setInterval(() => {
    blinkRate = tempBlinkRate * 6;
    tempBlinkRate = 0;
  }, 10000);
}

function updateBlinkRate() {
  tempBlinkRate++;
}

function getEucledianDistance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function getEAR(upper, lower) {
  return (
    (getEucledianDistance(upper[5][0], upper[5][1], lower[4][0], lower[4][1]) +
      getEucledianDistance(
        upper[3][0],
        upper[3][1],
        lower[2][0],
        lower[2][1]
      )) /
    (2 *
      getEucledianDistance(upper[0][0], upper[0][1], upper[8][0], upper[8][1]))
  );
}

function getIsVoluntaryBlink(blinkDetected) {
  // NOTE: checking if blink is detected twice in a row, anything more than that takes more deleberate effort by user.
  // NOTE: adding this to separate intentional blinks
  if (blinkDetected) {
    if (blinked) {
      return true;
    }
    blinked = true;
  } else {
    blinked = false;
  }

  return false;
}

function loadFont(){

    const loader = new THREE.FontLoader();
    loader.load( 'fonts/techno.json', function ( response ) {
	
	antifont = response;
	
	//refreshText();
	
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
