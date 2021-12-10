# anti

Anti es un llamado a la responsabilidad de los datos, al compromiso y el cuidado y a la realización de usuarixs que desdibujan las fronteras de la pasividad política y económica teniendo como epicentro lo sensible.

Utiliza tecnología de detección de puntos de referencia faciales [face-landmarks-detection](https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection) para predecir uno o más rostros.

Sobre esta información se dibuja una capa que permite ofuscar la imagen que se genera a partir de la captura de la cámara web de una computadora.

## Modo exhibición

Anti es un pedazo de software que tiene dos funciones: expresar, por medio de lo sensible, reflexiones sobre el papel de la persona en redes sociales, las tecnologías digitales de vigilancia y ofuscación y la escritura de y con software. 

El modo exhibición de anti es narrativo y expresa dos momentos centrales de la reflexión resultante del proyecto: 

## Manual de uso cotidiano

El uso cotidiano implica la reconexión y el ruteo del resultado audiovisual ofuscado hacia aplicaciones como zoom, meets etc. 

[Jack](https://jackaudio.org/) y [OBS Studio](https://obsproject.com/es/download) son las soluciones modulares que mejor se adaptan a Linux, MacOS y Windows. 

Demo

### Video con OBS (linux, macOS y windows) 

OBS Studio es la forma más fácil de transmitir video como una cámara web virtual. 

Basta con dar clic en iniciar cámara virtual y seleccionar la cámara en cuestión del lado de la app 

### Video con v4l2loopback y Ffmpeg (linux)

Esta opción es más ligera pero solamente puede ejecutarse en linux.

Se puede usar v4l2loopback y Ffmpeg. Por lo general es posible instalarlos con gestores de paquetes como pacman o apt-get. Es importante tener los headers de linux.

En Arch: linux-headers

Una vez instalado:

`# modprobe v4l2loopback`

En otra línea de comando 

`ffmpeg -f x11grab -r 20 -s 1920x1080 -i :0.0+0,0 -vcodec rawvideo -pix_fmt yuv420p -threads 0 -f v4l2 /dev/video0`

Se pueden variar parámetros como -r 20 (tasa de cuadros por segundo) y -s 1920x1080 (tamaño del lienzo capturado). Estos parámetros afectan el rendimiento de la computadora

Mientras tanto es necesario capturar una ventana no obstruída por otra ventana (por ejemplo, en otro escritorio) 

### Audio

Jack permite conectar la entrada del micrófono a SuperCollider. Las soluciones para rutear la salida de SuperCollider a la entrada de alguna aplicación (por ejemplo, una videollamada) dependen del sistema operativo y a continuación se enlistan. 

## Demos

Enlace 1

Enlace 2

# Recursos

- https://itnext.io/promise-loading-with-three-js-78a6297652a5
- https://github.com/tweenjs/tween.js/
- https://github.com/theankurkedia/blink-detection
- https://github.com/Tonejs/Tone.js/wiki/Time
- https://tonejs.github.io/docs/r13/CrossFade
- https://webrtchacks.github.io/WebRTC-Camera-Resolution/
- https://www.linux-magazine.com/Online/Features/Generating-QR-Codes-in-Linux
- https://hackaday.com/2021/09/24/adversarial-makeup-your-contouring-skills-could-defeat-facial-recognition/?
- https://www.latercera.com/la-tercera-domingo/noticia/la-tecnodiversidad-una-filosofia-contra-el-apocalipsis/FQD4XYJWMVCYZHMLEAQH25VCLU/
- https://gist.github.com/rampfox/085bf3ffb9ff51e114bf7afdf3ced71b
- https://github.com/tensorflow/tfjs-models/tree/master/blazeface
- https://github.com/justadudewhohacks/face-api.js/
- https://github.com/AndersJessen/FaceAPIJS-ThreeJS
- https://google.github.io/mediapipe/solutions/face_detection.html
- https://github.55860.com/jeeliz/jeelizFaceFilter
- https://www.html5rocks.com/es/tutorials/getusermedia/intro/
- http://phrogz.net/tmp/image_move_sprites_canvas.html
- https://towardsdatascience.com/face-landmarks-detection-with-mediapipe-facemesh-555fa2e10b06
- https://www.npmjs.com/package/perlin-noise-3d
- https://stackoverflow.com/questions/26415778/getusermedia-video-size-in-firefox-chrome-differs
- https://github.com/keijiro/Skinner
- https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-18-04
- https://nicknetvideos.com/blog/post/how-to-run-a-website-in-a-subdomain-in-digital-ocean
- https://tonejs.github.io/
- https://doc.sccode.org/Guides/FFT-Overview.html
- http://www.whole-play.com/post/chuck-browser-communication-with-osc/
- https://github.com/adzialocha/osc-js
- https://github.com/MylesBorins/node-osc
- https://developers.google.com/web/updates/2017/12/audio-worklet
- https://github.com/umlaeute/v4l2loopback
- https://scsynth.org/t/tutorial-supercollider-server-plugins-in-c/
- https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection
- https://threejs.org/
- https://supercollider.github.io/
- https://developer.mozilla.org/es/docs/Web/API/Web_Audio_API	
- https://github.com/PAIR-code/scatter-gl
- https://github.com/kylemcdonald/ofxFaceTracker
