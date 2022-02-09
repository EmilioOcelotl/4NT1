 /////////////////////////////////
// ///////// 4NT1 /////////////////
// ////////////////////////////////

import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as THREE from 'three';
import {TRIANGULATION} from './js/triangulation';
import * as Tone from 'tone';
import Stats from 'stats.js';
import {EffectComposer} from './jsm/postprocessing/EffectComposer.js';
import {RenderPass} from './jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from './jsm/postprocessing/UnrealBloomPass.js';
import {GlitchPass} from './jsm/postprocessing/GlitchPass.js';
import {TTFLoader} from './jsm/loaders/TTFLoader.js';
import {AfterimagePass} from './jsm/postprocessing/AfterimagePass.js';
import {ImprovedNoise} from './jsm/math/ImprovedNoise.js';
import { GUI } from './jsm/libs/dat.gui.module.js';
const TWEEN = require('@tweenjs/tween.js')

///////////////////// Variables importantes

let boolText = true; 
let boolGui = false; 
let boolStats = false; 
let boolMic = true; 

/////////////////////

let scene, camera, renderer, material, geometryPoints;
let geometryC, materialC, materialC2;
let cuboGrande = new THREE.Mesh(); let cuboGrande2 = new THREE.Mesh();
let font;
let text = new THREE.Mesh(); let text2 = new THREE.Mesh();
let matArray = [];
let prueba = 4;
let postB = true;

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
let  keypoints = []; 
let laterales = [];
let geometry = new THREE.BufferGeometry();
let mesh = new THREE.Mesh();
let meshB = new THREE.Mesh();
let degree = 0;
let xMid;

let model, videoWidth, videoHeight, video;

const loaderHTML = document.getElementById('loaderHTML');
const startButton = document.getElementById( 'startButton' );
const myProgress = document.getElementById( 'myProgress' );
const myBar = document.getElementById( 'myBar' );
const body = document.getElementById( 'body' );

// con boton

/*
document.querySelector('button').addEventListener('click', async () => {
    await Tone.start(); 
    // console.log('audio is ready')
    init(); 
})
*/

Tone.start().then( (x) => init()) // sin botón ( modo exhibición ) 

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
    textureSize =1024 * dpr;
    console.log('Estático');
}

let texture;
const vector = new THREE.Vector2();
let afterimagePass, bloomPass; 
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

if(boolMic){
    distortion.toDestination();
}

const pitchShift = new Tone.PitchShift().connect(distortion);
pitchShift.pitch = -3;
pitchShift.windowSize = 0.03;

const mic = new Tone.UserMedia(2);
let openmic; 

mic.open().then(() => {
    // openmic = true;
    mic.connect( pitchShift ); 
});

let glitchPass; 

let stream
let gSignal, gFin, gTranscurso; 

let stopRendering = false;
let irises = false; 
// let contriangulos = 0; 

let suspendido = false; 
let modoOscuro = true; 

let txtPosX = 1;
let txtPosY = 1; 
let txtPosX2 = 1;
let txtPosY2 = 1; 

let matPoints = []; 

let clock;

let creditos = false; 
let antifont; 

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
    "Un motivo para la reflexión",
    "Intervalos que varían\nen función\nde la sintaxis"
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

// Quitar esto 

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

var params = {opacidad: 0.5,damp: 0.5,tamaño: 10,perlin: 0.01, rojo: 255,verde: 0,azul: 255,texto: true,retro: true, sonido: true, voz: false,grano: 0.01,altura: 0}

let videoFolder = []; 
let audioFolder = []; 
let wireline; 

let keyactualX = [];
let keyanteriorX = [];

let keyactualY = [];
let keyanteriorY = [];
let velsX = [], velsY = [], vels = [];

let avg;
let velarriba, velabajo, velizquierda, velderecha; 
let trigeom = new THREE.BufferGeometry();
let trimesh = new THREE.Mesh(); 
let triPosiciones = [];
let triCantidad = 880; // probar con 100, luego 880  
let triGeometry = [];
let blackPlane; 

let triangulos = []; 

let vit;
let trimaterial; 

var hydra = new Hydra({
    canvas: document.getElementById("myCanvas"),
    detectAudio: false
})
    
const elCanvas = document.getElementById( 'myCanvas');
elCanvas.style.display = 'none'; 
let arre = []; 
vit = new THREE.CanvasTexture(elCanvas);

// /////////// Camara

async function setupCamera() {

    if(navigator.userAgent.match(/firefox|fxios/i)){

	camWidth = 640;
	camHeight = 480;	
	wCor = 30.5;
	hCor = 25;

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

	wCor = 38.5;
	hCor = 28
	
	if(!mobile){
	    camSz = 7;
	} else {
	    camSz = 10; 
		
	}}
    
    video = document.getElementById('video');
    stream = await navigator.mediaDevices.getUserMedia({
	'audio': false,
	'video': {
	    facingMode: 'user',
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

    predictions = await model.estimateFaces({
	input: video,
	returnTensors: false,
	flipHorizontal: false,
	predictIrises: irises,
    });
    
    if( buscando && exBool ){
	fin = Date.now();
	transcurso = (fin - inicio) / 1000;
    }

    if(buscando && creditos){
	finCreditos = Date.now();
	transCreditos = ( finCreditos - inicioCreditos) / 1000; 
    }
    
    score();
        
    if (prueba != predictions.length ) {
	initsc0();
    }

    prueba = predictions.length;

    arre = []; 
    vueltas = 0;
    
    trimaterial.map.needsUpdate = true;

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
	    
	    let time = Date.now() * 0.0005;
	    
	    if (buscando) {
		switch ( escena ) {
		case 0: // 0 - titulo 1 Podría suspenderse ? 
		    animsc1();
		    break;
		case 1: // 1 - escena 1
		    animsc1();
		    break;
		case 2: // 2 - titulo 2 Podría suspenderse? 
		    animsc1();
		    break;
		case 3: // 3 - escena 2
		    animsc2();
		    break;
		case 4: // 4 - titulo 3
		    // animsc3(); 
		    break;
		case 5: // 5 - escena 5
		    // animIrises(); // antes
		    animsc3() 
		    break; 
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
	
    } else {
	
	text.position.x = txtPosX;
	text.position.y = txtPosY;	
	text2.position.x = txtPosX2;
	text2.position.y = txtPosY2;
	
    }
    
    // panner.positionX.value = degree *2; // degree reducido
    //console.log(degree * 4);
    // cuboGrande.rotation.x += 0.001;
    // cuboGrande.rotation.y += (degree/4) * 0.005;

    camera.lookAt( scene.position );
    camera.rotation.z = Math.PI;

    if(boolStats){
	stats.update();
    }
    
    renderer.render( scene, camera );
 
    // console.log(degree); 
    vertices = [];
    composer.render();
  
    if(cuboGBool || suspendido ){
	vector.x = ( window.innerWidth * dpr / 2 ) - ( textureSize / 2 );
	vector.y = ( window.innerHeight * dpr / 2 ) - ( textureSize / 2 );
	renderer.copyFramebufferToTexture( vector, texture );
    }

    /// texto movimiento

    let delta, time; 
	delta = clock.getDelta();
	time = clock.getElapsedTime() * 10;
	var time2 = Date.now() * 0.0005;

    if(!mobile){

	// const position = geometry.attributes.position;

	text.geometry.attributes.position.needsUpdate = true;
	
	for ( let i = 0; i < text.geometry.attributes.position.count; i ++ ) {
	    // let d = perlin.noise(txtPos1[i] * 0.001 +time  );
	    
	    let d = perlin.noise(
		text.geometry.attributes.position.getX(i) * 0.04+ time2,
		text.geometry.attributes.position.getY(i) * 0.04 + time2,
		text.geometry.attributes.position.getZ(i) * 0.04+ time2) *  0.125; 
	    text.geometry.attributes.position.setZ( i, textCopy1.geometry.attributes.position.getZ(i) + d ); 
	}

	text2.geometry.attributes.position.needsUpdate = true;
	
	for ( let i = 0; i < text2.geometry.attributes.position.count; i ++ ) {

	    let d = perlin.noise(
		text2.geometry.attributes.position.getX(i) * 0.04+ time2,
		text2.geometry.attributes.position.getY(i) * 0.04 + time2,
		text2.geometry.attributes.position.getZ(i) * 0.04+ time2) *  0.125; 
	    text2.geometry.attributes.position.setZ( i, textCopy2.geometry.attributes.position.getZ(i) + d );
	    
	}
    }
    
    if(cuboGBool){
	var time2 = Date.now() * 0.0005;
    
	const algo = cuboGrande.geometry.attributes.position;
	const algo2 = cuboGrandeOrg.geometry.attributes.position;
		
	algo.needsUpdate = true;
	algo2.needsUpdate = true; 
	// algoOrg.needsUpdate = true; 
	    
	for ( let i = 0; i < algo.count; i ++ ) {
	    
	    let d = perlin.noise(
		algo2.getX(i) * 0.001+ time2,
		algo2.getY(i) * 0.001 + time2,
		algo2.getZ(i) * 0.001 + time2) *  0.125; 
	    
	    // let d = perlin.noise(txtPos1[i] * 0.001 +time  ); 

	    algo.setX( i,  cuboGrandeOrg.geometry.attributes.position.getX(i) + (1+d) );
	    algo.setY( i,  cuboGrandeOrg.geometry.attributes.position.getY(i) + (1+d) );
	    algo.setZ( i,  cuboGrandeOrg.geometry.attributes.position.getZ(i) + (1+d) );
	    // txtPos1.setX( i, txtPos1init.attributes.position.x); 
	}
    }

    let oldAvg;
    
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
    oldAvg = avg; 
    avg = (sum / vels.length) || 0;
    
    //sphereNuevo.scale.x.lerp(avg/4, 0.1) ; // Ñep 
    
    // arriba 10
    // abajo 152
    // izq 234
    // der 454
    
    // promedio de las velocidades de todos los puntos
    // promedios dependiendo de puntos específicos
    
   // console.log( avg / 100 ); // Promedio general 

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

    scene.background = vit;
    
    camera.position.z = 40;
    camera.rotation.z = Math.PI;
    
    clock = new THREE.Clock();
    // cols(); 

    const geometryVideo = new THREE.PlaneGeometry( camWidth/7, camHeight /7, 16, 16);
    materialVideo = new THREE.MeshBasicMaterial( {
	color: 0xffffff,
	side: THREE.DoubleSide,
	transparent: true,
	opacity: 1,
    } );
    
    planeVideo = new THREE.Mesh( geometryVideo, materialVideo );
    planeVideo.rotation.x = Math.PI;
    planeVideo.position.z = -10;
    
    // retro();
    materiales();

    for(let i = 0; i < 3; i++){
	matPoints[i] = new THREE.PointsMaterial( {
	    color: 0x000000,
	    blending: THREE.SubtractiveBlending,
	    //alphaTest: 0.9, 
	    //map: vit 
	} );
    }

    planeB = [new THREE.Points( pGeometry[0], matPoints[0] ), new THREE.Points( pGeometry[1], matPoints[1] ), new THREE.Points( pGeometry[2], matPoints[2] )];
   
    for (var i = 0; i < 3; i++) {
	pGeometry[i].verticesNeedUpdate = true;
    }

    geometryB = new THREE.BufferGeometry();
    geometryB.verticesNeedUpdate = true;

    /*
    let audioSphere = new THREE.BoxGeometry( 400, 400, 400, 32, 32, 32 );
    let audioSphere2 = new THREE.BoxGeometry( 400, 400, 400, 32, 32, 32 );
    cuboGrande = new THREE.Mesh(audioSphere, materialC2 );
    cuboGrandeOrg = new THREE.Mesh(audioSphere2, materialC2 );
    */
    
    texto();
    loadFont(); 
    
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize );

    if( boolStats ){
	container.appendChild( stats.dom ); // para dibujar stats 
    }
    
    const renderScene = new RenderPass( scene, camera );

    //bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    
    composer = new EffectComposer( renderer );
    composer.addPass( renderScene );
    //composer.addPass( bloomPass );

    afterimagePass = new AfterimagePass();
    composer.addPass( afterimagePass );
    afterimagePass.uniforms['damp'].value = 0.85;

    model = await faceLandmarksDetection.load(
	faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
	{maxFaces: 1,
	 shouldLoadIrisModel: true, // Hay que cargar un poco más de archivos 
	 // maxContinuousChecks: 120
	});

    trimaterial = new THREE.MeshBasicMaterial( {
	color: 0xffffff,
	side: THREE.DoubleSide,
	blending: THREE.SubtractiveBlending,
	map:vit,	
    } ); 

    for(let i = 0; i < 3; i++){
	const x = Math.random() * 200 - 100;
	const y = Math.random() * 200 - 100;
	const z = Math.random() * 200 - 100;
	triPosiciones.push(x, y, z); 	
    }
    
    var quad_uvs =[0.0, 0.0,1.0, 0.0, 1.0, 1.0];
    
    for(let i = 0; i < triCantidad; i++){
	
	triGeometry[i] = new THREE.BufferGeometry();
	triGeometry[i].setAttribute( 'position', new THREE.Float32BufferAttribute( triPosiciones, 3 ) );
	triGeometry[i].setAttribute( 'uv', new THREE.Float32BufferAttribute( quad_uvs, 2))
	triGeometry[i].usage = THREE.DynamicDrawUsage; 
	triangulos[i] = new THREE.Mesh( triGeometry[i], trimaterial  );
	
    }
    
    for(let i = 0; i < triCantidad; i++){
	scene.add(triangulos[i]);
	triangulos[i].position.z = -4;
	triangulos[i].rotation.y = Math.PI*2;
    }

    const geometryPlane = new THREE.PlaneGeometry( 1000, 1000 );
    const materialPlane = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide} );
    blackPlane = new THREE.Mesh( geometryPlane, materialPlane );
    blackPlane.position.z = -10; 
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
	rmsc3(); 
	// rmIrises(); 
	hush();
	scene.background = new THREE.Color(0x000000);
	
	modoOscuro = true;

	for(let i = 0; i < triCantidad; i++){
	    scene.remove(triangulos[i]); 
	}

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

    } else {

	// Resetear el cubo

	/*
	let audioSphere = new THREE.BoxGeometry( 400, 400, 400, 32, 32, 32 );
	cuboGrande = new THREE.Mesh(audioSphere, materialC2 );
	cuboGrandeOrg = new THREE.Mesh(audioSphere, materialC2 );
	*/
	
	loopTxt.stop(0); 
	planeVideo.geometry.dispose();
	const geometryVideoNew = new THREE.PlaneGeometry( camWidth/camSz, camHeight/camSz ); // Dos modalidades para el cel

	planeVideo.geometry = geometryVideoNew; 
	materialVideo.map = new THREE.VideoTexture( video );
	respawn.start(); 

	escena = 0;

	// Tal vez esto es redundante, se va comentado para pruebas

	/*
	if(exBool){
	    titulo1();
	} else {
	    if(escena == 1){
		initsc1(); 
	    }
	    if(escena == 3){
		initsc2(); 
	    }
	    if(escena == 5){
		initsc3(); 
	    }
	}
	*/

	titulo1(); 

	transcurso = 0; 
	inicio = Date.now();
	segundo = 0;
	modoOscuro = false;
	buscando = true;
	// scene.add( cuboGrande );
	scene.add( text );
	scene.add( text2 );
	// Tone.Destination.mute = false; 
	intro.stop();

    }
}

function titulo1(){

    matPoints[0].size = 0; 
    scene.background = vit; 
    selektor(Math.floor(Math.random() * 5)); 

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
    //scene.remove( cuboGrande ); 
    // text.material.color = new THREE.Color(0xffffff);
    // text.material = trimaterial; 
    cuboGBool = false;
   
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
    
    for(let i = 0; i < triCantidad; i++){	    
	scene.remove(triangulos[i]);
    }

    
}

function initsc1() {

    scene.add( blackPlane ); 
    // cuboGBool = true; 
    loopOf.start(0);
    line.stop();
    outline.stop(); 
    irises = false;    
    afterimagePass.uniforms['damp'].value = 0.85;
    perlinValue = 0.03;
    perlinAmp = 4;
    scene.add( planeVideo);
    planeVideo.material.opacity = 1; 
    // scene.remove( planeVideo ); 
    //scene.add(cuboGrande); 
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
	    scene.add( planeB[cuentaPlane] );
	    cuentaPlane++;
	});
    }
    
    for(let i = 0; i < triCantidad; i++){	    
	scene.add(triangulos[i]);
    }
    
    pitchShift.pitch = -12 ; // cambios dinámicos para el futuro 
   
}

function animsc1() { 

    var time2 = Date.now() * 0.0005;
    
    if(exBool){
	perlinValue = 0.003+(transcurso/60*0.003); // suspendido temporalmente  
	// planeVideo.material.opacity = 0.75+transcurso/60;
	matPoints[0].size =  (Math.sin(time * 0.5) *1) ; 
    }
    
    // pitchShift.windowSize = Math.sin(time2 * 0.125) * 0.01; // esperar mejores tiempos
    
    // capa hydra

    arre = arre.flat(2);
    let triconta = 0;
    for(let j = 0; j < triCantidad; j++){	
	let d = perlin.noise(
	    arre[triconta*3] * 0.002 + time2,
	    arre[(triconta*3)+1] * 0.002 + time2,
	    arre[(triconta*3)+2] * 0.002 + time2) *  0.125; 
	for(let i = 0; i < 3; i++){
	    triGeometry[j].attributes.position.setX( i, (arre[triconta*3] * 0.12 -wCor)*(1.1+d) ); 
	    triGeometry[j].attributes.position.setY( i, (arre[(triconta*3)+1] * 0.12 - hCor) * (1.1+d) );
	    triGeometry[j].attributes.position.setZ( i, (arre[(triconta*3)+2] * 0.05) * (1+d) );
   	    triconta++; 
	}
    }

    // capa blend
    
    var time2 = Date.now() * 0.0005;
    for ( let i = 0; i < position[vueltas].count; i ++ ) {
	let d = perlin.noise(
	    keypoints[i][0] * 0.01 + time2,
	    keypoints[i][1] * 0.01 + time2,
	    keypoints[i][2] * 0.01 + time2) *  1; 
	// const analisis = Tone.dbToGain ( analyser.getValue()[i%64] ) * 20;
	position[vueltas].setX( i, (1+keypoints[i][0] * 0.12 - wCor) * (1+d) ); 
	position[vueltas].setY( i, (1+keypoints[i][1] * 0.12 - hCor) * (1+d) ); // aquí está raro 
	position[vueltas].setZ( i, (keypoints[i][2] * 0.05)   );
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

    scene.remove(blackPlane); 
    scene.background = vit; 
    selektor(Math.floor(Math.random() * 5)); 
    
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

    for(let i = 0; i < triCantidad; i++){	    
	scene.remove(triangulos[i]);
    }
 
    pitchShift.pitch = -12 ; // cambios dinámicos para el futuro tal vez con una secuencia    
    
}

// Escena 2

function initsc2() {

    scene.add( blackPlane); 
    // selektor(0); 
    
    // cuboGBool = true; 
    loopRod.start(0); 
    // line.start(0); 
    // loop.start(0); 
    
    text.material.color = new THREE.Color(0xffffff); 
    scene.add( planeVideo);
    afterimagePass.uniforms['damp'].value = 0.85;

    perlinValue = 0.003;
    perlinAmp = 2;
    
    // cuboGrande.material.opacity = 0; 
    // scene.add(cuboGrande); 
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
	    planeB[0].material = matPoints[Math.floor(Math.random()*3)]; 
	    scene.add( planeB[cuentaPlane] );
	    cuentaPlane++;
	});
    }

    for(let i = 0; i < triCantidad; i++){	    
	scene.add(triangulos[i]);
    }

}

function animsc2() {

    if(exBool){
	perlinValue = 0.03-((transcurso-60)/60*0.03); 
	// planeVideo.material.opacity = 1;
	matPoints[0].size = 1 - (transcurso-60)/60; 
    }

    // pitchShift.windowSize = Math.sin(time2 * 0.125) * 0.01;
    // capa hydra

    arre = arre.flat(2);
    let triconta = 0;
    var time2 = Date.now() * 0.0005;
    
    for(let j = 0; j < triCantidad; j++){	
	
	let d = perlin.noise(
	    arre[triconta*3] * 0.008 + time2,
	    arre[(triconta*3)+1] * 0.008 + time2,
	    arre[(triconta*3)+2] * 0.008 + time2) *  0.5; 
	
	for(let i = 0; i < 3; i++){
	    triGeometry[j].attributes.position.setX( i, (arre[triconta*3] * 0.12 -wCor)*(1.2+d) ); 
	    triGeometry[j].attributes.position.setY( i, (arre[(triconta*3)+1] * 0.12 - hCor) * (1.2+d) );
	    triGeometry[j].attributes.position.setZ( i, (arre[(triconta*3)+2] * 0.05) * (1.2*d) );
   	    triconta++; 
	}
    }
        
    var time2 = Date.now() * 0.0005;

    for ( let i = 0; i < position[vueltas].count; i ++ ) {

	let d = perlin.noise(keypoints[i][0] * perlinValue + time2,
			     keypoints[i][1] * perlinValue + time2,
			     keypoints[i][2] * perlinValue + time2) *  0.5; 

	position[vueltas].setX( i, (1+keypoints[i][0] * 0.12 - wCor) * (1+d) ); 
	position[vueltas].setY( i, (1+keypoints[i][1] * 0.12 - hCor) * (1+d) );
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

// Titulo 3

function titulo3(){

    scene.remove(blackPlane); 
    scene.background = vit; 
    selektor(Math.floor(Math.random() * 5)); 
    
    loopOf.stop(0);
    loopRod.stop(0); 
    loopTxt.stop(0);     
    outline.start();

    if(boolText){
	chtexto(
	    "III\nCompromiso y escritura", // otro título, este está mucy chafa
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

    for(let i = 0; i < triCantidad; i++){	    
	scene.remove(triangulos[i]);
    }
    
    pitchShift.pitch = -12 ; // cambios dinámicos para el futuro 
   
    
}

// Escena 2

function initsc3() {

    scene.add( blackPlane); 
    // cuboGBool = true; 
    loopRod.start(0); 
    // line.start(0); 
    // loop.start(0); 
    
    text.material.color = new THREE.Color(0xffffff); 
    scene.add( planeVideo);
    afterimagePass.uniforms['damp'].value = 0.85;

    perlinValue = 0.003;
    perlinAmp = 2;
    
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

    for(let i = 0; i < triCantidad; i++){	    
	scene.add(triangulos[i]);
    }

}

function animsc3() {

    if(exBool){
	perlinValue = 0.03-((transcurso-60)/60*0.03); 
	// planeVideo.material.opacity = 1;
	matPoints[0].size = 1 - (transcurso-60)/60; 
    }

    // pitchShift.windowSize = Math.sin(time2 * 0.125) * 0.01;
    
    // capa hydra

    arre = arre.flat(2);
    let triconta = 0;
    var time2 = Date.now() * 0.0005;
    
    for(let j = 0; j < triCantidad; j++){	
	
	let d = perlin.noise(
	    arre[triconta*3] * 0.008 + time2,
	    arre[(triconta*3)+1] * 0.008 + time2,
	    arre[(triconta*3)+2] * 0.008 + time2) *  0.5; 
	
	for(let i = 0; i < 3; i++){
	    triGeometry[j].attributes.position.setX( i, (arre[triconta*3] * 0.12 -wCor)*(1.2+d) ); 
	    triGeometry[j].attributes.position.setY( i, (arre[(triconta*3)+1] * 0.12 - hCor) * (1.2+d) );
	    triGeometry[j].attributes.position.setZ( i, (arre[(triconta*3)+2] * 0.05) * (1.2*d) );
   	    triconta++; 
	}
    }
        
    var time2 = Date.now() * 0.0005;

    for ( let i = 0; i < position[vueltas].count; i ++ ) {

	let d = perlin.noise(keypoints[i][0] * perlinValue + time2,
			     keypoints[i][1] * perlinValue + time2,
			     keypoints[i][2] * perlinValue + time2) *  0.5; 

	position[vueltas].setX( i, (1+keypoints[i][0] * 0.12 - wCor) * (1+d) ); 
	position[vueltas].setY( i, (1+keypoints[i][1] * 0.12 - hCor) * (1+d) );
	position[vueltas].setZ( i, keypoints[i][2] * 0.05  );
    }

    planeB[vueltas].geometry.computeVertexNormals();
    planeB[vueltas].geometry.attributes.position.needsUpdate = true;
    position[vueltas].needsUpdate = true;
    vueltas++;
}

function rmsc3() {
   for (let i = 0; i < planeB.length; i++) {
	scene.remove( planeB[i] );
    }
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

/*
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
*/ 

/*
function rmIrises(){
    irises = false; 
}
*/ 

function reinicio(){
}

function selektor( sc ){
    
    switch(sc){
    case 0:
	shape(4,0.7).mult(osc(20,-0.009,9).modulate(noise(3,1)).rotate(0.7)).modulateScale(osc(4,-0.09,0).kaleid(50).scale(0.6),15,0.1).out()
	break;
    case 1:
	shape(4,0.7)
	    .mult(osc(20,-0.009,9).modulate(noise(3,1)).rotate(0.7))
	    .modulateScale(osc(4,-0.09,0).kaleid(50).scale(0.6),15,0.1)
	    .out()
	break;
    case 2:
	noise(5,0.99).modulate(noise(2),0.92).scrollX(0.19,0.09).modulateScrollY(osc(2).modulate(osc().rotate(),.11)).scale(2.9).color(0.9,1.014,1).color(5,1,50).out()
	break;
    case 3:
	osc(3,0.01,9)
	    .mult(osc(2,-0.1,1).modulate(noise(3,1)).rotate(0.7))
	    .posterize([3,10,2].fast(0.5).smooth(1))
	    .modulateRotate(o0,() => Math.sin(time)*3)
	    .color(5,1,50)
	    .scrollX(1,() => (0.1 * Math.sin(time*.00009)))
	    .out()
	break;
    case 4:
	noise(1,0.99).modulate(noise(10),0.12).scrollX(0.19,0.09).modulateScrollY(osc(0.2).modulate(osc(0.1).rotate(),.11)).scale([.72,9,5,4,1].fast(1).smooth(0.9)).color(0.9,1.014,1).color(1,[50,2,20].fast(0.0),5).out()
	break; 

    }   
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
      6. initsc3    135 - x s
      7. reinicio  x   - x + 30 s 
 
     */
    
    if(buscando){

	//  Primera escena 
	
	if ( transcurso.toFixed() == 5 && segundo != 5 ) {
	    console.log("Primera Escena"); 
	    segundo = transcurso.toFixed(); 
	    modoOscuro = false; 
	    escena = 1;
	    rmsc1();
	    rmsc2();
	    rmsc3(); 
	    // rmIrises(); 
	    initsc1();
	}

	// titulo 2 Estos números podrían variar ligeramente ? 

	if ( transcurso.toFixed() == 65 && segundo != 65 ) {
	    console.log("Título 2");
	    segundo = transcurso.toFixed();
	    escena = 2; 
	    rmsc1();
	    rmsc2();
	    rmsc3(); 
	    // rmIrises();
	    titulo2(); 
	    
	}
	
    // Segunda escena 
    
	if ( transcurso.toFixed() == 70 && segundo != 70 ) {
	    console.log("Segunda Escena"); 
	    segundo = transcurso.toFixed();
	    modoOscuro = false; 
	    escena = 3;
	    rmsc1();
	    rmsc2();
	    rmsc3(); 
	    initsc2();
	    
	}

	// Tercer Título 

	if ( transcurso.toFixed() == 125 && segundo != 125 ) {
	    console.log("Título 3");
	    segundo = transcurso.toFixed();
	    escena = 4; 
	    rmsc1();
	    rmsc2();
	    rmsc3(); 
	    // rmIrises();
	    titulo3(); 
	}

	// Tercera escena 
	
	if ( transcurso.toFixed() == 130 && segundo != 130 ) {
	    console.log("Tercera Escena"); 
	    segundo = transcurso.toFixed();
	    modoOscuro = true;
	    // irises = true; 
	    escena = 5;
	    rmsc1();
	    rmsc2();
	    rmsc3(); 
	    // initIrises(); // Antes
	    initsc3(); 
	    
	}

	if ( transcurso.toFixed() == 160 && segundo != 160 ) {
	    console.log("Epilogo"); 
	    segundo = transcurso.toFixed();
	    // modoOscuro = true; 
	    escena = 7;
	    rmsc1();
	    rmsc2();
	    rmsc3(); 
	    // rmIrises();	    
	}

	// Si paso ese tiempo y no parpadearon entonces reinicia
	
	if ( transcurso.toFixed() == 165 && segundo != 165 && !creditos ) {
	    console.log("Reinicio"); 
	    segundo = transcurso.toFixed();
	    // modoOscuro = true; 
	    escena = 8;
	    rmsc1();
	    rmsc2();
	    // rmIrises();
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

    videoFolder.add(params, 'tamaño',  0.01, 50, 0.01).onChange(function(){
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
	    color: 0xffffff,
	    side: THREE.DoubleSide,
	    blending: THREE.AdditiveBlending,
	} );

    const loader1 = new THREE.FontLoader();

	loader1.load( 'fonts/square.json', function( font ) {
	    
	    const message = "";
	    const shapes = font.generateShapes( message, 0.75);
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

    txtPosX = posX;
    txtPosY = posY;	
    txtPosX2 = posX2;
    txtPosY2 = posY2;
    
    const message = mensaje; 
    const shapes = antifont.generateShapes( message, 1.25 );
    const geometry = new THREE.ShapeGeometry( shapes );
    geometry.computeBoundingBox();
    geometry.computeVertexNormals(); 
    const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
    geometry.translate( xMid, 0, 0 );
    text.geometry.dispose(); 
    text.geometry= geometry;
    text.material.dispose();

    text.position.x = txtPosX; 
    text.position.y = txtPosY;
    text.position.z = 10;
    
    const message2 = mensaje2; 
    const shapes2 = antifont.generateShapes( message2, 1.25 );
    const geometry2 = new THREE.ShapeGeometry( shapes2 );
    geometry2.computeBoundingBox();
    geometry2.computeVertexNormals(); 
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

/*
function retro() {
    const data = new Uint8Array( textureSize * textureSize * 3 );
    texture = new THREE.DataTexture( data, textureSize, textureSize, THREE.RGBFormat );
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
}
*/

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

async function detonar() {
    await renderPrediction();

    // sonido();

    if(boolGui){
	guiFunc(); 
    }
    
    loaderHTML.style.display = 'none';

    console.log('██╗  ██╗███╗   ██╗████████╗ ██╗\n██║  ██║████╗  ██║╚══██╔══╝███║\n███████║██╔██╗ ██║   ██║   ╚██║\n╚════██║██║╚██╗██║   ██║    ██║\n     ██║██║ ╚████║   ██║    ██║\n     ╚═╝╚═╝  ╚═══╝   ╚═╝    ╚═╝'); // fps();
    inicio = Date.now();
    respawn.start(); 
}

/*
function cols() {
    colores = [new THREE.Color( 0x59181E ),
	       new THREE.Color( 0x5C1452 ),
	       new THREE.Color( 0x45195C ),
	       new THREE.Color( 0x25145C ),
	       new THREE.Color( 0x000000 )];
}
*/

function materiales() {

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
