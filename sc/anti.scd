/////////////////////////////////
//////////// 4NT1 ///////////////
/////////////////////////////////

// p = ProxySpace.push(s.boot);

s.boot

i = Buffer.read(s, "/home/emi/Música/4NT1/uxmal.wav");

a = []; b = []; c = []; // inicializar arreglos

PlayBuf

(

SynthDef(\kp, {
	arg

	freq1 = #[10, 20, 30, 40, 50, 10, 20, 30, 40, 50, 10, 20, 30, 40, 50],
	freq2 = #[10, 20, 30, 40, 50, 10, 20, 30, 40, 50, 10, 20, 30, 40, 50],
	index = #[0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1];

    var inA, chainA, inB, chainB, chain, sin, rand, outS, outD, lim;

	rand = Demand.kr(Impulse.kr(10), 0, Drand([0, 1, 0, 0, 1, 0, 0, 0, 0, 0], inf));
    sin = SinOsc.ar(0.1, 0, 2, 8);

	inA = PMOsc.ar(freq1,freq2, index, 0, 0.6).sum;
	// inB = SoundIn.ar(0);
	inB = PlayBuf.ar(1, i, BufRateScale.kr(i), doneAction: Done.freeSelf)

	chainA = FFT(LocalBuf(2048), inA);
    chainB = FFT(LocalBuf(2048), inB);
	chainB = PV_MagFreeze(chainB, rand > 0.5 );

	chain = PV_MagMul(chainA, chainB); // writes into bufferA

	outS = DelayC.ar(IFFT(chain), 0.01, 0.0006*0.75) * EnvFollow.ar(IFFT(chain), 1 - (0.0006 * SampleRate.ir).reciprocal).max(0.174377).reciprocal *0.25!2; // para las otras rolas está a 0.2

    //outD = GVerb.ar(BPF.ar(IFFT(chain), Array.geom(8, 50, 1.5), 1/4).sum, 80, 5.85, 0.41, 0.19, 15, -3.dbamp, -5.dbamp, -5.dbamp, 180, 1) * 0.2;

	lim = Limiter.ar(outS);

	Out.ar([0, 1], lim  );

}).add

)


z = Synth(\kp);
s.meter

(
a = Array.fill(15,{100+rand(15000)});
z.setn(\freq1, a);


b = Array.fill(15,{100+rand(15000)});
z.setn(\freq2, b);

c = Array.fill(15,{rand(30)});
z.setn(\index, c);

)
(



// Recibir, guardar y normalizar en x y z

OSCdef(\kpxBoca, {|msg, time, addr, recvPort|
	// msg.postln;
	// msg.size;
	a = Array.fill(15, { arg i; msg[i+2] });
	a = a.normalize(100.0, 6000.0); // que 1400 sea el centro y 30 los extremos (abs)
	// ~pmosc.setn(\freq1, a);
	z.setn(\freq1, a);

	//a.postln;

}, '/kpxBoca', nil);

OSCdef(\kpyBoca, {|msg, time, addr, recvPort|
	b = Array.fill(15, { arg i; msg[i+2] });
	b = b.normalize(100.0, 6000.0); // que 1400 sea el centro y 30 los extremos (abs)

	z.setn(\freq2, b);
	// ~pmosc.setn(\freq2, b);
	//b = b.normalize;
	//b.postln
	// x.set(\arreglo, b);

}, '/kpyBoca', nil);

OSCdef(\kpzBoca, {|msg, time, addr, recvPort|
	c = Array.fill(15, { arg i; msg[i+2] });
	c = c.normalize(0.01, 30.0);
	z.setn(\index, c);

	// ~pmosc.setn(\index, c);
	//c = c.normalize;
	//c.postln
	//x.setn(\arreglo, c);

}, '/kpzBoca', nil);


)

// Mezclar la señal del pmosc con la voz

