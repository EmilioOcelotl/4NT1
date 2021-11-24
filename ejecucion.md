## Ejecución  

Primero:

`git clone https://github.com/tensorflow/tfjs-models`

`cd face-landmarks-detection`

Luego:

`git clone https://github.com/EmilioOcelotl/4NT1`

JS [Three.js + TS.js] en modo local: 

`yarn`

`yarn watch`

Para el sitio 

`yarn deployar` 

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

