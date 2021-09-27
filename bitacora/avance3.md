# Tercer avance

## Pendientes generales

- [ ] ¿Cómo mantener la premisa del proyecto ?

### Texto

- [ ] Escritura del texto que estará dentro de la piezas
- [ ] El texto que estará fuera de la pieza puede ser un artículo académico que a su vez, podría dar forma a un capítulo de la tesis
  - [ ] Observaciones transversales a las piezas > fijación, obsolescencia y . Contexto (cuidado con eso, primero auto-crítica) 

### Audio

- [ ] Remixeo de algunas rolas
- [ ] Mantener los audios sin master para usarlos en algún otro momento 

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
- [x] renderPrediction y animate juntos. Separados generan contradiccción de flujo
- [x] Arreglar la reproducción del video en navegadores
- [x] Asociar posición de un rostro a la cámara 
- [x] Probar blazeface para más ligereza. No funciona 
- [x] efectos y triangulación aleatoria
- [x] Score en la consola
- [x] Distintas resoluciones de la textura para móviles y para escritorio 
- [x] Tiempo en segundos y no en ciclos de animación - diferencias de fps
- [ ] Cambiar archivos de github al server
- [ ] Construir el modelo localmente 
- [ ] ¿ Dispose y creación de geometrías que no se estén usando ?
- [ ] Audio reactividad en cubo grande
- [ ] Texto más extenso, extractos que se detonan a partir de ciertas acciones. Secciones de acuerdo la presencia y no presencia de prediccciones 
- [ ] Checar las dependencias del nuevo demo para resolver optimización y vulnerabilidades 
- [ ] Ajustar resolución por defecto de los dispositivos a las acciones del canvas 
- [ ] ¿ Hydra como textura ?
- [ ] Manual online y offline de montaje para anexarlo a la entrega
- [ ] Arreglar cable dañado
- [ ] Desplazarse de la imagen y el sonido al texto 
- [ ] Comprar un mouse y un teclado. 
- [ ] Esperar a tiempos mejores


## Para la muestra 

- ~~Prueba de 6 horas.~~
- ~~Hacer otros demos (controlador)~~ 
- ~~Fondo negro~~
- ~~Cubrebocas y reconocimiento facial~~

- **Presencial**: Código QR para acceder desde el móvil 
- **Digital**: Enlace para acceder con una compu o un móvil 

- **Ambos Casos**: Versión de escritorio y versión para móvil 

### Preguntas 

- ¿ 10 fps es suficiente en el móvil ? 

## Para el futuro mediano u otro proyecto

- multiplayer online
- Versión performeada 

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
- La captura de la pantalla es costosa. Puede funcionar en la compu pero en móviles se incrementa el desempeño
- Blazeface no es tan eficiente. En compus ligeras congela el navegador 
