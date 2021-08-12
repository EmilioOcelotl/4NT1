# Tercer avance

## Pendiente general

- ¿Cómo mantener la premisa del proyecto ? 

## Avances y pendientes 

- [x] Modificar la textura del video
- [x] logotipo fonca
- [x] Pedir recomendaciones de montaje
- [x] Mismo tamaño de video para todos los navegadores 4:3
- [x] Usar una versión más reciente de tsjs
- [x] Probar perlin noise 
- [x] Quitar luces
- [x] Porcentaje en vez de barra?
- [x] multijugador local
- [ ] Cambiar archivos de github al server
- [ ] Movimiento de la cámara 
- [ ] efectos y triangulación aleatoria
- [ ] Importante: en algunos casos la máquina webgl no se inicializa bien. Pasa en teléfonos y también ha pasado en computadoras 
- [ ] Construir el modelo localmente 
- [ ] ¿ Dispose y creación de geometrías que no se estén usando ?
- [ ] Audio reactividad en cubo grande
- [ ] Texto más extenso, extractos que se detonan a partir de ciertas acciones. Secciones de acuerdo la presencia y no presencia de prediccciones 
- [x] renderPrediction y animate juntos. Separados generan contradiccción de flujo
- [ ] Sugerir que la app en el móvil solamente funciona en modo horizontal (modo vertical está raro)
- [ ] Reducir procesamiento en el navegador para más fps
- [x] Arreglar la reproducción del video en navegadores 
- [ ] Sin retro en dispositivos móviles. En general: optimización 
- [ ] Checar las dependencias del nuevo demo para resolver optimización y vulnerabilidades
- [ ] Versión escritorio y móvil, implementar nueva librería. Evaluar sustitución  
- [ ] Asociar posición de un rostro a la cámara 

## Para la muestra 

- ~~Prueba de 6 horas.~~
- ~~Hacer otros demos (controlador)~~ 
- ~~Fondo negro~~
- ~~Cubrebocas y reconocimiento facial~~

- **Presencial**: Código QR para acceder desde el móvil 
- **Digital**: Enlace para acceder con una compu o un móvil 

- **Ambos Casos**: Versión de escritorio y versión para móvil 

## Para el futuro mediano u otro proyecto

- multiplayer online 

## Comentarios

- quitar FPS
- Primitivos con texturas básicas sobre el rostro
- Feedback como un instrumento - Feedback héptico en tiempos de COVID
- Evidencia visual de que el sonido se está modificando
- Tutorial para hacer un objeto con wasm
- eficiencia > el problema no es la relación de aspecto
- Parece que en algunos casos hay problemas para cargar el contexto de webGL. En la computadora pasó cuando utilicé una resolución muy grande en la pantalla. Tendrá que ver con el tamaño de la ventana del navegador? La tasa de cuadros bajo hasta 1 o 2. Sospecha: el mismo motor cambia a cpu
- retroalimentación háptica - comunicación y [la simulación d]el sentido del tacto
- Interesante: tecnologías orientadas al mercado y tecnologías orientadas a un resultado robusto > Qué tanto se puede usar en móviles 