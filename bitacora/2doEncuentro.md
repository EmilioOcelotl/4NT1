![portada](https://github.com/EmilioOcelotl/4NT1/blob/main/img/antiBanner2do.png)

# 4NT1

Estudios de ofuscación audiovisual para el navegador.

## Cambios

Modo híbrido que prioriza la exhibición en línea.

## Resultados

[Liga provisional](https://test.ocelotl.cc/) y documentación ( este repositorio ) .

## Antecedentes y consecuencias 

- Sistemas portables 
- Proyectos en el navegador

## Avances

- Escritura de módulos. Primeros estudios que exploran el entramado de software. 

### Esqueleto 

- Construcción del proyecto, depuración e inclusión de dependencias.
- Pruebas en modo local ( acceso restringido a la cámara sin certificados )
- Compra de dominio y activación de subdominio ( mantenimiento, legado, registro y documentación - PLab )
- Generación de certificado y encriptación "segura" para acceder a la cámara
- Empaquetado y montaje ( dependencias y archivos de audio e imagen )

### Análisis

- Plataforma de aprendizaje automático seleccionada: Tensorflow - exacta y lenta orientada a web
- Número de predicciones y puntos de interés ( keypoints ) en tiempo real como el núcleo de la aplicación
- Relación predicciones y puntos - audio e imagen
- Delimitación de la aplicación para hacerla más eficiente ( webGL y sin detección de iris ) 

### Control, interacción y estructura 

- Estructura de inicialización y detonación de funciones para evitar errores 
- Diseño del programa, estructura semiabierta con escenas que pueden interactuar con usuarixs
- Cámara y detección de rostro como control de la aplicación - Sin GUI 
- Interfaz que pueda activarse sin contacto físico - Modalidad híbrida 
- Ludificación y multijugador ( local y en línea - PLab )

### Audio

- Pruebas con sintetizadores granulares en SC y el navegador ( ofuscación comprometida ) 
- Cambios propuestos afectaron este rubro. Marco elegido: Tone.js 
- Modo mixto - grabaciones que se modifican por el motor de audio
- Cadena de efectos tipo procesamiento final 
- Para el futuro - secuenciadores con llamadas a funciones para el navegador que retomen premisas de demand y patrones ( sc ) 
- Como parte de lo anterior - microintervalos de tiempo y modo concreto ( control de audio ) 
- Implicaciones teóricas - Escala de tiempo ( Curtis Roads ) como motivo de creación - reflexión - realización tecnológica
- Prueba fallida: Envío de OSC a SuperCollider en modo local ( app de Node )

### Imagen

- Marco elegido: Three.js
- Calibración de puntos de interés, objeto p/ punto.
- Dibujo del video como textura en el render de threejs
- Dibujo de fuentes optimizadas para el navegador. Asociación de texto a rotación de la cabeza (incompleto) 
- De manera similar al audio: cadena de efectos tipo procesamiento final 
- Transiciones y escenas asociadas a la estructura semi-abierta
- Modificación de meshes y relación audioreactiva 
- Video y el mismo render como textura 

### Texto

- Visualización de algunos datos 
- Reflexiones con premisas tipo tesis que pueden expresarse como texto gráfico dentro de la aplicación 
- Estas tesis pueden expandirse posteriormente en un texto
- ¿ Texto como eje para la práctica / reflexión multihilo ?

## Integración

Colección de escenas ( tesis ) a manera de ensayo audiovisual para el navegador ( en diálogo con un ensayo convencional ).

## Pendientes

- Atender vulnerabilidades y depurar más dependencias 
- Optimizar para móviles 
- La cámara se activa muy extrañamente en Firefox
- Audio más delimitado y diversificado
- Máscaras que coincidan con los puntos de interés
- Multijugador
