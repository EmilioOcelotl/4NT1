/////////////////////////////////
//////////// 4NT1 ///////////////
/////////////////////////////////

p = ProxySpace.push(s.boot);

a = []; b = []; c = []; // inicializar arreglos
s.meter

(

// Recibir, guardar y normalizar en x y z

OSCdef(\kpxBoca, {|msg, time, addr, recvPort|
	// msg.postln;
	// msg.size;
	a = Array.fill(15, { arg i; msg[i+1] });
	a = a.normalize(30.0, 1400.0); // que 1400 sea el centro y 30 los extremos (abs)
	~pmosc.setn(\freq1, a);

	//a.postln;

}, '/kpxBoca', nil);

OSCdef(\kpyBoca, {|msg, time, addr, recvPort|
	b = Array.fill(15, { arg i; msg[i+1] });
	b = b.normalize(30.0, 1400.0); // que 1400 sea el centro y 30 los extremos (abs)
	~pmosc.setn(\freq2, b);
	//b = b.normalize;
	//b.postln
	// x.set(\arreglo, b);

}, '/kpyBoca', nil);

OSCdef(\kpzBoca, {|msg, time, addr, recvPort|
	c = Array.fill(15, { arg i; msg[i+1] });
	c = c.normalize(0.01, 30.0);
	~pmosc.setn(\index, c);
	//c = c.normalize;
	//c.postln
	//x.setn(\arreglo, c);

}, '/kpzBoca', nil);


)

// Mezclar la señal del pmosc con la voz

(

~pmosc = {

	arg

	freq1 = #[10, 20, 30, 40, 50],
	freq2 = #[10, 20, 30, 40, 50],
	index = #[0.1, 0.1, 0.1, 0.1, 0.1];

	Pan2.ar(PMOsc.ar(freq1,freq2, index, 0, 0.05))}

)
~pmosc.play

s.meter




