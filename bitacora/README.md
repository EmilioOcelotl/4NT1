# Bitácora

## Boceto

[Propuesta](https://github.com/EmilioOcelotl/anti/tree/main/pdf/flujo.pdf) para el flujo y análisis de datos. 

[Posibles caminos](https://github.com/EmilioOcelotl/anti/tree/main/pdf/fonca.pdf) de resolución tecnológica. Hasta el momento hay ejercicios pequeños para cada ruta. 


## Aspectos generales 

Aspecto muy cercano al proyecto: Estetización de la resistencia >  Maquillaje y wearables. 

[ANTI-SURVEILLANCE MAKEUP TUTORIAL BY PUSSY RIOT / How to resist to the electronic police state?](https://www.youtube.com/watch?v=Seex9ayhIfc&ab_channel=PussyRiot)

Sobre la vigilancia y proyectos de investigación pasados: Herramientas de extracción de información (por ejemplo sonora no necesariamente musical) se utilizan para la composición tipo paisaje sonoro. Se utilizan las mismas herramientas para complementar sistemas de vigilancia audiovisuales, 

Detección de caras: Pedazo de software que detecta características faciales. Face-landmarks-detection 

4NT1 en el contexto del encierro pandémico: Duda sobre el formato de exhibición presencial. En este sentido el navegador puede ser el formato de salida para la pieza.

Tensorflow como una biblioteca de código abierto para aprendizaje automático. Este proyecto utiliza tfjs con lo cual es posible utilzar esta biblioteca en el navegador.

Uso de tecnologías de google para proyectos de anti-vigilancia ¿contradicción? reapropiación tecnológica y apertura de cajas negras. 

TF.js funciona en navegadores y en móviles. Actualmente es posible detectar puntos de referencia faciales con móbiles desde el navegador. 

WebGL y el trabajo con gráficos en el navegador. Queda pendiente integrar/desplazar el proyecto de scatter-gl a three.js

Acceso y el problema de la escalada técnica.

Limitaciones del navegador: Ideas que actualmente pueden realizarse de manera parcial. Alternativa: aplicación local. 

En este último caso quedaría pendiente la realización del proyecto como aplicación, utilizar openCV y versiones anteriores de OpenFameworks.

## Organización del sistema y notas técnicas. Revisar Nuevas Modalidades. 

En estos primeros pasos de exploración el punto de partida es el navegador.

face-landmark-detection está basado en tensorflow.js

Complementación del proyecto con three.js para los detalles visuales y Web Audio API para el sonido.

Si el proyecto pudiera realizarse en términos técnicos desde la misma computadora para que pudiera funcionar como una app o una extensión, entonces no sería posible compilar el proyecto con web assembly para que tuviera las mismas consecuencias en la web pero no duplicar esfuerzos (versión web y versión local). 

Último pendiente: hacer pruebas de detección / no-detección con una máquina

¿Una versión live ya está old? 

## Comentarios 3 mar 2021

- ¿La pieza tendrá estructura? ¿Cómo usar esto sin que ese convierta en un mouseX, mouseY?
- Captura y envío de datos: expresiones > investigar sobre información facial > problematización de los datos. 
- Síntesis y análisis en el servidor, solo ciertos aspectos en el navegador.
- Otro tipo de gestualidades por ejemplo las manos. 
- Descartr la vía de openFrameworks. 
- ¿ Multi-jugador ?

## anti > phd

- La nube como una especie de alegoría que va hacia la cuestión de la síntesis y del trabajo web con nodos

## Panoramas

- tensorflow.js + otras cosas + webGL > navegador
- ofxFaceTracker + OF + openGL > ejecutable

## anti > primer encuentro

- Protocolos de comunicación (OSC, WebRTC, audio de algún tipo )
- software artesanal vs plataformas de alto nivel
- Centralidad del activismo ambiental en el uso de recursos tecnológicos.
- Salidas, experiencia de usuario y campaña de difusión
- Software como un arma de dos filos. 
- Relación con otros proyectos > máscaras, ofuscación, visibilidad en web 
- Comentario personal: ¿Dos instancias?

Respuesta a: 

https://expansion.mx/tecnologia/2021/03/31/el-padron-de-telefonia-es-inviable-y-atenta-contra-los-derechos-digitales

La cuestión de la máscara como impostura y como evasión, como un dispositivo para difuminarse en pos de la seguridad o una causa común. 

https://github.com/umlaeute/v4l2loopback/ usar v4l2loopback y ffmpeg

ffmpeg -f x11grab -r 20 -s 1920x1080 -i :0.0+0,0 -vcodec rawvideo -pix_fmt yuv420p -threads 0 -f v4l2 /dev/video0

Modulador de distorsión (ofuscación cotidiana y ofuscación experimental) 

Prioridades 

### c++ [OF + OpenCV]: 

Potencialmente descartable. 

- Compilar OF 0.10.0 o menor
- Clonar [ofxFaceTracker](https://github.com/kylemcdonald/ofxFaceTracker) 
- Referencia a la carpeta compilada

`cd ofanti`

`make`

`make RunRelease`


## Pendientes

- [x] ¿face-landmarks-detection en jetson nano?
- [x] Camara usb vs integrada
- [x] Integración webgl threejs
- [x] Probar alternativas: openCV + openFrameworks
- [ ] ¿Prueba con OpenCV 4?  
- [ ] Salida como webcam 
- [ ] Hacer pruebas y calibrar 
- [ ] Depurar / actualizar dependencias en JS
- [ ] ScatterGL a Three.js
- [ ] Captura y envío de señales de audio desde el navegador
- [ ] Captra y envío de datos 
- [ ] Ampliar estado del arte