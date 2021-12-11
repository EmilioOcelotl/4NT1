# Anti 

Anti es un llamado a la responsabilidad de los datos, al compromiso y el cuidado y a la realización de usuarixs que desdibujan las fronteras de la pasividad política y económica teniendo como epicentro lo sensible.

Utiliza tecnología de detección de puntos de referencia faciales [face-landmarks-detection](https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection) para predecir uno o más rostros.

Sobre esta información se dibuja una capa que permite ofuscar la imagen que se genera a partir de la captura de la cámara web de una computadora.

[Sitio](https://anti.ocelotl.cc) 

Demo 1

Demo 2

## Exhibición 

Anti es un pedazo de software que tiene dos funciones: expresar, por medio de lo sensible, reflexiones sobre el papel de la persona en redes sociales, las tecnologías digitales de vigilancia y ofuscación y la escritura de y con software. 

El modo exhibición de anti es narrativo y expresa dos momentos centrales de la reflexión resultante del proyecto: 

## Uso cotidiano 

El uso cotidiano implica la reconexión y el ruteo del resultado audiovisual ofuscado hacia aplicaciones como zoom, meets etc. 

[Jack](https://jackaudio.org/) y [OBS Studio](https://obsproject.com/es/download) son las soluciones modulares que mejor se adaptan a Linux, MacOS y Windows. 

### Video con OBS (linux, macOS y windows) 

OBS Studio es la forma más fácil de transmitir video como una cámara web virtual. 

Basta con dar clic en iniciar cámara virtual y seleccionar la cámara en cuestión del lado de la app

![obs](/assets/img/obs.png)

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

## Diagrama de montaje

Montaje y operación de **anti** en modo exhibición.

Una versión impresa de este documento será agregada a la entrega de JC.  

Versión digital: [https://github.com/EmilioOcelotl/4NT1/tree/main/manualJC](https://github.com/EmilioOcelotl/4NT1/tree/main/manualJC)

### Diagrama

La siguiente imagen es una aproximación gráfica al montaje 

![Diagrama](../img/montaje.jpg)

### Instrucciones de montaje

#### 1. Computadora 

La computadora mac mini es el centro de la configuración tecnológica. Las conexiones son las siguientes: 

![Diagrama](../img/macmini.png)

#### 2. Conexión a Internet

Es necesario que esta computadora se conecte a la red del sitio (de preferencia ethernet pero también es posible hacerlo con wifi).

Para conectar la computadora a internet vía WIFI es necesario realizar lo siguiente (solamente una vez) :

2.1 Encender la computadora. Una vez que se despliegue la obra, presionar F11 para salir del modo pantalla completa y minimizar el navegador

2.2 Buscar en el escritorio la aplicación Wicd y dar doble clic 

![wifi1](../img/wifi1.png)

2.3 Dar clic en buscar redes, encontrar la red en cuestión

Es posible realizar estas conexiones con el mouse y el teclado incluídos con la entrega.

![wifi2](../img/wifi2.png)

2.3 Dar clic, introducir la contraseña cuando la aplicación lo solicite 

![wifi3](../img/wifi3.png)

Nota: En la entrega se adjunta un mouse para activar estas opciones. Por defecto, cuando se selecciona una casilla, es posible activar un teclado virtual. La entrada de texto puede realizarse con el mouse y el teclado virtual. 

#### 3. Imagen

El monitor puede montarse en la pared a 1,67 m de altura (altura promedio de los ojos) con respecto al suelo. Para hacer esto es posible quitar la base del monitor.

En caso de que no sea posible montar el monitor a la pared, es posible colocarlo en una mesa o soporte que se aproxime en altura a la magnitud antes indicada.

Sobre el monitor debe colocarse la cámara web que a su vez, se conecta vía usb a la computadora. La cámara debe inclinarse para que capture el rostro de las personas. 

El cable HDMI conecta el monitor a la computadora. Es importante que el cable HDMI esté conectado y el monitor encendido antes de encender la computadora

El monitor puede ser calibrado en caso de que sea necesario. 

#### 4. Audio

Las conexiones de audio se realizan en la parte posterior del subwoofer como se indica en la siguiente magen:

![](../img/wub.png) 

El cable jack mini a RCA conecta el audio de la computadora al monitor de audio activo.

Posteriormente es necesario conectar el cable sencillo del monitor activo al pasivo

#### 5. Interacción

Por el contexto de la pandemia de COVID-19, es necesario que las personas se quiten el cubrebocas para experimentar la pieza. En este sentido, algunas indicaciones en físico pueden ser señaladas. La obra incorpora indicaciones con texto y grabaciones de voz digitales.

### Mantenimiento

1.- Primero, es necesario encender el monitor y las bocinas con el botón correspondiente. 

2.- Después, la obra se enciende manualmente con el botón de encendido que se encuentra en la parte trasera de la computadora

3.- La computadora se apaga automáticamente a la hora de cierre de la muestra.

4.- Es necesario apagar el monitor y las bocinas manualmente. 

## Recursos

- [https://itnext.io/promise-loading-with-three-js-78a6297652a5](https://itnext.io/promise-loading-with-three-js-78a6297652a5)
- [https://github.com/tweenjs/tween.js/](https://github.com/tweenjs/tween.js/)
- [https://github.com/theankurkedia/blink-detection](https://github.com/theankurkedia/blink-detection)
- [https://github.com/Tonejs/Tone.js/wiki/Time](https://github.com/Tonejs/Tone.js/wiki/Time)
- [https://tonejs.github.io/docs/r13/CrossFade](https://tonejs.github.io/docs/r13/CrossFade)
- [https://webrtchacks.github.io/WebRTC-Camera-Resolution/](https://webrtchacks.github.io/WebRTC-Camera-Resolution/)
- [https://www.linux-magazine.com/Online/Features/Generating-QR-Codes-in-Linux](https://www.linux-magazine.com/Online/Features/Generating-QR-Codes-in-Linux)
- [https://hackaday.com/2021/09/24/adversarial-makeup-your-contouring-skills-could-defeat-facial-recognition/?](https://hackaday.com/2021/09/24/adversarial-makeup-your-contouring-skills-could-defeat-facial-recognition/?)
- [https://www.latercera.com/la-tercera-domingo/noticia/la-tecnodiversidad-una-filosofia-contra-el-apocalipsis/FQD4XYJWMVCYZHMLEAQH25VCLU/](https://www.latercera.com/la-tercera-domingo/noticia/la-tecnodiversidad-una-filosofia-contra-el-apocalipsis/FQD4XYJWMVCYZHMLEAQH25VCLU/)
- [https://gist.github.com/rampfox/085bf3ffb9ff51e114bf7afdf3ced71b](https://gist.github.com/rampfox/085bf3ffb9ff51e114bf7afdf3ced71b)
- [https://github.com/tensorflow/tfjs-models/tree/master/blazeface](https://github.com/tensorflow/tfjs-models/tree/master/blazeface)
- [https://github.com/justadudewhohacks/face-api.js/](https://github.com/justadudewhohacks/face-api.js/)
- [https://github.com/AndersJessen/FaceAPIJS-ThreeJS](https://github.com/AndersJessen/FaceAPIJS-ThreeJS)
- [https://google.github.io/mediapipe/solutions/face_detection.html](https://google.github.io/mediapipe/solutions/face_detection.html)
- [https://github.55860.com/jeeliz/jeelizFaceFilter](https://github.55860.com/jeeliz/jeelizFaceFilter)
- [https://www.html5rocks.com/es/tutorials/getusermedia/intro/](https://www.html5rocks.com/es/tutorials/getusermedia/intro/)
- [http://phrogz.net/tmp/image_move_sprites_canvas.html](http://phrogz.net/tmp/image_move_sprites_canvas.html)
- [https://towardsdatascience.com/face-landmarks-detection-with-mediapipe-facemesh-555fa2e10b06](https://towardsdatascience.com/face-landmarks-detection-with-mediapipe-facemesh-555fa2e10b06)
- [https://www.npmjs.com/package/perlin-noise-3d](https://www.npmjs.com/package/perlin-noise-3d)
- [https://stackoverflow.com/questions/26415778/getusermedia-video-size-in-firefox-chrome-differs](https://stackoverflow.com/questions/26415778/getusermedia-video-size-in-firefox-chrome-differs)
- [https://github.com/keijiro/Skinner](https://github.com/keijiro/Skinner)
- [https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-18-04](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-18-04)
- [https://nicknetvideos.com/blog/post/how-to-run-a-website-in-a-subdomain-in-digital-ocean](https://nicknetvideos.com/blog/post/how-to-run-a-website-in-a-subdomain-in-digital-ocean)
- [https://tonejs.github.io/](https://tonejs.github.io/)
- [https://doc.sccode.org/Guides/FFT-Overview.html](https://doc.sccode.org/Guides/FFT-Overview.html)
- [http://www.whole-play.com/post/chuck-browser-communication-with-osc/](http://www.whole-play.com/post/chuck-browser-communication-with-osc/)
- [https://github.com/adzialocha/osc-js](https://github.com/adzialocha/osc-js)
- [https://github.com/MylesBorins/node-osc](https://github.com/MylesBorins/node-osc)
- [https://developers.google.com/web/updates/2017/12/audio-worklet](https://developers.google.com/web/updates/2017/12/audio-worklet)
- [https://github.com/umlaeute/v4l2loopback](https://github.com/umlaeute/v4l2loopback)
- [https://scsynth.org/t/tutorial-supercollider-server-plugins-in-c/](https://scsynth.org/t/tutorial-supercollider-server-plugins-in-c/)
- [https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection](https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection)
- [https://threejs.org/](https://threejs.org/)
- [https://supercollider.github.io/](https://supercollider.github.io/)
- [https://developer.mozilla.org/es/docs/Web/API/Web_Audio_API](https://developer.mozilla.org/es/docs/Web/API/Web_Audio_API)	
- [https://github.com/PAIR-code/scatter-gl](https://github.com/PAIR-code/scatter-gl)
- [https://github.com/kylemcdonald/ofxFaceTracker](https://github.com/kylemcdonald/ofxFaceTracker)
