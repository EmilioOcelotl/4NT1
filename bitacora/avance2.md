# Segundo Informe

## Avances y pendientes

Objetivo general: Constuir el marco de trabajo para la realización de las escenas de la pieza. 

- [x] Actualizar librerías y vulnerabilidades graves en dependencias
- [x] Agregar la librería threejs
- [x] Usar una parte del escritorio como cámara web
- [x] Trasladar pointcloud de scatterGL a threejs
- [x] Mostrar una máscara que funcione con dos capas: el video y el mesh cubriendo / modificando el rostro 
- [x] Prueba local con SuperCollider > Trasladar coordenadas como algún tipo de mensaje OSC.
- [x] Escribir Node app (puente entre UDP y clientes de WebSocket)
- [x] Enviar audio en modo dummy con supercollider
- [x] Probar la granulación de Tone.js
- [x] Probar pvcalc y composición con data espectral 
- [x] Resolver el dibujo de fuentes
- [x] Botón de inicio para iniciar el contexto de audio
- [x] Construir el modelo localmente y carpeta antijs
- [x] Platicar sobre el futuro
- [x] Mínima interfaz 
- [x] Keypoints dobles y triples
- [x] Efectos para encadenar hacia un master final sonoro
- [x] Bosquejo de escenas
- [x] Post, Effect composer y jsm para encadenar hacia un master final visual
- [x] Cargando
- [x] Montaje provisional en un sitio web y pruebas con otras computadoras
- [x] Certificado de seguridad para abrir cámara
- [ ] Re-indexar vertices 
- [ ] Separar escenas en funciones 
- [ ] Asignar meshes y sonidos a más de una persona 
- [ ] Transiciones y dispose 
- [ ] Layers para objetos con bloom y sin bloom 
- [ ] Framebuffer para algo de magia 
- [ ] Indicadores de lo que está pasando 
- [ ] Actualizar package.json en repositorio 
- [ ] Arreglar texturas 
- [ ] Optimización para cel y compus de placa reducida: esperar a que el render términe de cargar 
- [ ] Desplegar un mensaje si no hay cámara

## Actividades realizadas

- Estudios y maquetas audiovisuales 
- Ponencia en el programa de Maestría y Doctorado en Música
- Escritura de artículo sobre avances de dos piezas
- Escritura de artículo que habla de los antecedentes
- Espectativa en redes
- Concierto interconectado

## Problemas (posibles y que han surgido) 

- Para el modo digital en servidor: ¿Qué pasa si se conecta más de una persona? 
- Enviar tantos datos vía OSC es problemático.
- Procesamiento sonoro y visual final
- Equipo para la versión presencial
- Diseño de interfaz tipo GUI queda pendiente a la confirmación del modo híbrido

## Pendientes para el informe final

- [x] Montar todo en un servidor (y resolver problemas laterales) 
- [ ] Escenas con distintos estudios 

## Pendientes largo plazo

- [ ] Servidor autónomo 

## Apuntes generales

- El proyecto puede construirse para un modo híbrido que priorice la modalidad online 
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
- Sin audio.- Hasta 52 fps, Con audio sin sets.- Hasta 48 fps, con audio y sets 48 fps, el demo llega a 22
- Si pensamos en equivalencias funcionales entonces podríamos concebir el setInterval() como una estructura similar al Demand en SuperCollider. Para el tratamiento de la lectura de arreglos ¿sería posible implementar un equivalente a Dseq, Drand etc para la lectura secuenciada de valores? ¿Es posible todavía extenderlo a la lógica de Pseq? > problemas de doc
- El sueño: activar lo anterior en modo live coding
- No está fácil construir el modelo localmente, necesito encontrar soluciones, tal vez el problema está en la actualización de parcel.
- Ya es posible utilizar el modo multiplayer, hace falta asociar más sintetizadores a otras caras de manera independiente > ¿Será esto muy costoso?
- Leer el ultimo capitulo del SuperCollider Book > csound ya esta compilado para web
- Estándares industriales para el audio procesado en web 