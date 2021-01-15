# Anti

Exploraciones en torno a la anti-vigilancia. 

## Premisas

- Composición audiovisual conducida por datos. 
- Autorreferencialidad y retroalimentación con otros sistemas.
- Pedazo de software que pueda ser de utilidad en un contexto cotidiano.
- Desplazamiento de zona de confort (tecnológica). 
- Proyecto global: sistemas interactivos en el navegador. Véase: [Tres Estudios Abiertos](https://github.com/EmilioOcelotl/tres-estudios-abiertos)  

## Motivaciones

- Respuesta a la instagramización.
- Responsabilidad de datos. 

## Puesta en marcha

- Sistema interactivo empaquetado en una computadora de placa reducida.
- Software que corre en GNU/Linux pero que puede ejecutarse en otras plataformas.
- Bibliotecas de visión computarizada .
- Bibliotecas de aprendizaje automático. 

## Pendientes:

- [x] ¿face-landmarks-detection en jetson nano?
- [ ] Camara usb vs integrada
- [ ] Integración webgl threejs
- [ ] Monitor externo pequeño
- [ ] Probar alternativas: openCV + openFrameworks

## Observaciones

- Jetson nano + tensorflow + chromium = max 8 fps
- ofxFaceTracker solamente con ofv0.9.8. Problemas: openCV 4 y make 

[Bitácora](https://github.com/EmilioOcelotl/anti/bitacora/README.md) 

## Recursos

- https://blog.tensorflow.org/2020/03/face-and-hand-tracking-in-browser-with-mediapipe-and-tensorflowjs.html
- https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection