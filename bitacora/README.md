# Bitácora

## Aspectos generales 

Aspecto muy cercano al proyecto: Estetización de la resistencia  Maquillaje y wearables. 

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

## Panoramas

- tensorflow.js + otras cosas + webGL > navegador
- ofxFaceTracker + OF + openGL > ejecutable
- ofxARToolkit + OF + openGL (para dispositivos móviles > app de iOS

## Pendientes

- [x] ¿face-landmarks-detection en jetson nano?
- [ ] Camara usb vs integrada
- [ ] Integración webgl threejs
- [ ] Monitor externo pequeño
- [ ] Probar alternativas: openCV + openFrameworks
