# anti - Manual de ofuscación 

anti puede ejecutarse para correr en modo exhibición o en modo uso real

El modo exhibición se activa en el navegador y funciona en cualquier dipositivo con navegador web. Para desplegar el modo uso real es necesario complementar con módulos locales. Por el momento es posible desplegar este modo en el escritorio. 

El despligue del la interfaz de usuario permite ajustar modalidades

## Exhibición

Abrir [anti](https://anti.ocelotl.cc/) en el navegador 

## Uso cotidiano

[Jack](https://jackaudio.org/) y [OBS Studio](https://obsproject.com/es/download) son las soluciones modulares que mejor se adaptan a Linux, MacOS y Windows. 

Demo

### Video con OBS (linux, macOS y windows) 

OBS Studio es la forma más fácil de transmitir video como una cámara web virtual. 

Basta con dar clic en iniciar cámara virtual y seleccionar la cámara en cuestión del lado de la app 

## Video con v4l2loopback y Ffmpeg (linux)

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

#### Linux

## Pendientes

- [ ] Checar ruteo interno desde el navegador