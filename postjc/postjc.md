# Anti postjc 

Trabajar en esto para mover la pieza el siguiente año 

## Preguntas generales

- ¿ Es posible cambiar el pitch de las grabaciones para asociarlas al promedio de los keypoints sin que suene "chistoso"? 

## Pendientes

- [ ] webRTC, getUserMedia() y cableados internos
- [ ] Separar canales y hacer mezcla en three 
- [ ] Cambiar sonidos a unidades más pequeñas que puedan usarse en tonejs
- [ ] Asociar tempo general al promedio de la aceleración de keypoints
- [ ] Asociar otros keypoints a parámetros específicos 

## Audio

Separar los fondos en tracks

- melodía ( Sinte sencillo ) > promedio general como secuencia y como cambio de altura 
- Kick > promedio general como secuencia (bpm) 
- Snare > promedio general como secuencia (bpm)  
- Ruido ( variaciones de frecuencia ) > Promedio específico asociado a un eje 
- Wpa ( variaciones de altura en una muestra pregrabada ? ) Ojo: todo podría ser más ligero si se traslada a síntesis > Promedio específico asociado a un eje  
- bajo ( trasladar síntesis ? ) Ojo: sería importante hacer coincidir las notas con el cambio de escala > Promedio general como secuencia y como cambio de altura

- voz ( sería el único recurso grabado ) > Promedio general como altura  

- Será posible generar algo parecido a demagen, es decir, una secuencia general que afecte a las otras secuencias 

## Recursos

- https://webrtc.org/getting-started/media-devices#using-promises