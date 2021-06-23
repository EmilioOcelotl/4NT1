
# Segundo Informe

## Avances y pendientes

- [x] Actualizar librerías y vulnerabilidades graves en dependencias
- [x] Agregar la librería threejs
- [x] Usar una parte del escritorio como cámara web
- [x] Trasladar pointcloud de scatterGL a threejs
- [x] Mostrar una máscara que funcione con dos capas: el video y el mesh cubriendo / modificando el rostro 
- [x] Prueba local con SuperCollider > Trasladar coordenadas como algún tipo de mensaje OSC.
- [x] Escribir Node app (puente entre UDP y clientes de WebSocket
- [x] Enviar audio en modo dummy con supercollider
- [x] Probar la granulación de Tone.js
- [x] Probar pvcalc y composición con data espectral 
- [x] Resolver el dibujo de fuentes
- [x] Botón de inicio para iniciar el contexto de audio 
- [ ] Diseño de interfaz de usuario > Interacción, aspectos visuales y de control ¿GUI?
- [ ] Separar parte del código 
- [x] Pruebas con más de un rostro 
- [ ] Investigar sobre https 
- [ ] Activar y probar jetson nano 
- [ ] Platicar sobre el futuro
- [ ] Escenas 

## Actividades realizadas

- Estudios y maquetas audiovisuales 
- Ponencia en el programa de Maestría y Doctorado en Música
- Escritura de artículo sobre avances de dos piezas
- Escritura de artículo que habla de los antecedentes
- Espectativa en redes
- Concierto interconectado

## Posibles problemas

- Para el modo digital en servidor: ¿Qué pasa si se conecta más de una persona? 
- Enviar tantos datos vía OSC es problemático.
- Procesamiento sonoro y visual final
- Equipo si es que se logra la versión presencial 

## Pendientes para el informe final

- [ ] Montar todo en un servidor (si la modalidad es digital o a distancia). 

## Apuntes generales

- Concepto de nube de puntos es central para la realización visual y sonora.
- Necesario enviar nubes de puntos a cualquier otro lado vía OSC. Esto permitiría tener un flujo de puntos para SC pero también para OF
- Parece que el archivo triangulation ya tiene una estimación ¿podría ser esto la máscara, como mover el eje z'
- Serie de tres momentos que puedan ser modificador por quienes acceden o interactúan.
- Si ya estoy pensando en enviar mensajes osc de manera local podría pensar en dos opciones: instalación (presencial o en línea) y local.
- Enviar tantos datos en velocidad de cuadros por segundo se vuelve problemático.
- Keypoints y su comportamiento es el punto de partida, composición conducida por datos.
- Si no es posible utilizar pvcalc no tiene caso usar sc para generar audio, mejor usar tone.js
- facelandmark detection primero dibuja una mitad de la cara y luego la otra mitad. 234 es la mitad de la cara
- Sonificar el comportamiento de los puntos de la boca, sintesis y rango vocal para resintetizar con FFT y la entrada del micrófono.
- Los mismos datos como una fuente para la ofuscación.
- Descubrimiento: no hay eje z, entonces que pasa con esa info? Tal vez hay que ajustarla
- Es posible utilizar las mismas estructuras para enviar mensajes osc para realizar síntesis en el navegador, pensar en un modo expandido para hacer audio con sc y tone.js
- SetInterval como un equivalente para secuenciar en supercollider ¿Será posible trasladar algunas ideas ?
- Modalidad mixta que implique procesar pistas ya existentes en SC y modificarlo en js
- Fiabilidad y la emisión de Certificados de Seguridad
- setInterval y Demand como secuenciadores equivalentemente funcionales
- Tone.js parece insuficiente, aclarar si es posible usar supercollider de alguna manera
- setInterval como una forma de generar secuenciadores que puedan ajustarse a un tempo global pero que pueden utilizar unidades menores a 10 ms
- Cuidado con setInterval para cada cierto tiempo generar un clearInterval().
- Más caras > más elementos visuales y sonoros.
- Sin audio.- Hasta 52 fps, Con audio sin sets.- Hasta 48 fps, con audio y sets 48 fps  