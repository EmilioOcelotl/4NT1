
# Segundo Informe

## Avances y pendientes

- [x] Actualizar librerías y vulnerabilidades graves en dependencias
- [x] Agregar la librería threejs
- [x] Usar una parte del escritorio como cámara web
- [x] Trasladar pointcloud de scatterGL a threejs
- [x] Mostrar una máscara que funcione con dos capas: el video y el mesh cubriendo / modificando el rostro
- [ ] Texto que interactúe con audio e imagen  
- [ ] Diseño de interfaz de usuario > Interacción, aspectos visuales y de control ¿GUI? 
- [x] Prueba local con SuperCollider > Trasladar coordenadas como algún tipo de mensaje OSC.
- [x] Escribir Node app (puente entre UDP y clientes de WebSocket
- [x] Enviar audio en modo dummy con supercollider
- [ ] ¿Estrategia de difusión? alianza
- [ ] Rolas semiabiertas 
- [ ] Probar la granulación de Tone.js

## Actividades realizadas

- Estudios y maquetas audiovisuales 
- Ponencia en el programa de Maestría y Doctorado en Música
- Escritura de artículo sobre avances de dos piezas
- Escritura de artículo que habla de los antecedentes
- Espectativa en redes 

## Posibles problemas

- Para el modo digital en servidor: ¿Qué pasa si se conecta más de una persona? 
- Enviar tantos datos vía OSC es problemático

## Pendientes para el informe final

- [ ] Montar todo en un servidor (si la modalidad es digital o a distancia). 

## Apuntes generales

- Concepto de nube de puntos es central para la realización visual y sonora.
- Necesario enviar nubes de puntos a cualquier otro lado vía OSC. Esto permitiría tener un flujo de puntos para SC pero también para OF
- Parece que el archivo triangulation ya tiene una estimación ¿podría ser esto la máscara, como mover el eje z'
- Serie de tres momentos que puedan ser modificador por quienes acceden o interactúan.
- Si ya estoy pensando en enviar mensajes osc de manera local podría pensar en dos opciones: instalación (presencial o en línea) y local.
- Enviar tantos datos en velocidad de cuadros por segundo se vuelve problemático. 