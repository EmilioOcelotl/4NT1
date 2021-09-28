![portada](https://github.com/EmilioOcelotl/4NT1/blob/main/img/antiBanner2do.png)

# ANT1

> Donde el ingeniero consigue capturar todo lo que funciona para que todo funcione mejor, para ponerlo al servicio del sistema, el hacker se pregunta “¿cómo funciona?” para encontrarle fallas, pero también para inventarle otros usos, para experimentar. Experimentar significa entonces: vivir lo que implica éticamente tal o cual técnica. (Comité-invisible, 2014, p. 132)

*ANT1* busca problematizar las relaciones que existen entre usuarios y plataformas tecnológicas; es un paso hacia la realización de usuarixs que desdibujan las fronteras de la pasividad política y económica teniendo como epicentro lo sensible. El proyecto parte de la composición visual conducida por datos. Aprovecha la investigación y escritura de [tres estudios abiertos](https://github.com/EmilioOcelotl/tres-estudios-abiertos), un proyecto doctoral sobre nuevas prácticas artísticas en el navegador y librerías de síntesis granular para audio y video. 

La obra toma en cuenta la transformación de flujos de audio y video y se retroalimenta con la acción de agentes externos. Con técnicas de aprendizaje automático, detecta gestos faciales que son intepretados como un flujo de datos. El proyecto problematiza este flujo con el uso de tecnologías que implican una responsabilidad de los datos de usuarixs. De esta manera el proyecto pplantea una discusión que parte de la instagramización de la política y la estetización de la resistencia para desembocar en la política de la representación. 

*ANT1* es un pedazo de software que puede utilizarse en la vida cotidiana y que desplaza la ofuscación en el uso de tecnologías que funcionan como cajas negras al desarrollo de capas estéticas para la evasión. El proyecto contempla la comparación de dos caminos que permitan plantear una crítica al software como caja negra. Es un primer estudio de reflexión tecno-social. Retoma la idea de modularidad y se adscribe a los estudios del software, esto quiere decir que la obra se complementa con la programación, lectura, escritura y pensamiento con software. 

[Bitácora](https://github.com/EmilioOcelotl/anti/tree/main/bitacora) 

[Diagrama de montaje](https://github.com/EmilioOcelotl/anti/tree/main/pdf/antiEx.pdf) 

## Ejecución 

Primero:

`git clone https://github.com/tensorflow/tfjs-models`

`cd face-landmarks-detection`

Luego:

`git clone https://github.com/EmilioOcelotl/4NT1`

JS [Three.js + TS.js] en modo local: 

`yarn`

`yarn build`

o

`yarn build-deps`

Es posible activar la comunicación OSC. Para realizar esto es necesario descomentar algunas tripas y ejecutar: 

`node bridge.js`

## Ruteo de video

La manipulación de video puede transmitirse como una cámara virtual. Con las siguientes instrucciones es posible enviar ventanas personalizadas como si fuera una webcam conectada a la computadora. 

### Windows / Linux / Mac 

[OBS-Studio](https://obsproject.com/es) ya tiene algunas soluciones incorporadas. En Win/Linux es posible utilizar una cámara virtual. 

### Linux

Se puede usar v4l2loopback y Ffmpeg. Por lo general es posible instalarlos con gestores de paquetes como pacman o apt-get. Es importante tener los headers de linux.

En Arch: linux-headers

Una vez instalado:

`# modprobe v4l2loopback`

En otra línea de comando 

`ffmpeg -f x11grab -r 20 -s 1920x1080 -i :0.0+0,0 -vcodec rawvideo -pix_fmt yuv420p -threads 0 -f v4l2 /dev/video0`

Se pueden variar parámetros como -r 20 (tasa de cuadros por segundo) y -s 1920x1080 (tamaño del lienzo capturado). Estos parámetros afectan el rendimiento de la computadora

Mientras tanto es necesario capturar una ventana no obstruída por otra ventana.

Queda pendiente ver si es posible capturar ventanas independientes. 

## Escritura

Algunas ideas-reflexiones relacionadas con este proyecto se encuentran en:

- [Panorama](https://piranhalab.github.io/panorama/). Escritura de espacios libres e inmersivos para el performance audiovisual - Dorian Sotomayor, Marianne Teixido y Emilio Ocelotl (en proceso). 
- [Tres Estudios Abiertos](https://emilioocelotl.github.io/tres-estudios-abiertos/). Prácticas performáticas, audiovisuales y experimentales en el navegador - Emilio Ocelotl

## Recursos

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

## Referencias

- Comité-invisible (2014). [A nuestros amigos](http://mexico.indymedia.org/IMG/pdf/a_nuestros_amigos_-_comite_invisible.pdf).
- Cox, G. y McLean, A. (2013). Speaking Code. Coding as Aesthetic and Political Expression. The MIT Press.
- Platohedro, Correa, A., Alvarez, L. M., Fleischmann, L., Rodrı́guez, Y., Rueda, D., Jaramillo, J. A., Correa, C., y Narváez, O. (2019). Platohedro. [Multiversos](https://platohedro.org/multiversos/). Cráneo Invertido, Medellı́n, Colombia.
- Roads, C. (2001). Microsound. The MIT Press. 
- Soon, W. y Cox, G. (2020) [Aesthetic Programming: A Handbook of Software Studies](http://openhumanitiespress.org/books/download/Soon-Cox_2020_Aesthetic-Programming.pdf). Open Humanities Press. 

