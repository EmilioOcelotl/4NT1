p = ProxySpace.push(s.boot);
// Esperar poquito
s.scope;
s.meter;
//
p.makeTempoClock((140/120));
// p.quant = 4;
PirE.loadSamples();
// Esperar poquito

i = Buffer.read(s, "/home/emi/Música/4NT1/uxmal.wav");


~outS = {DelayC.ar(~out.ar*1, 0.01, 0.0006*0.75) * EnvFollow.ar(~out.ar*1, 1 - (0.0006 * SampleRate.ir).reciprocal).max(0.174377).reciprocal *0.5!2}; // para las otras rolas está a 0.2
~outD = {GVerb.ar(BPF.ar(~out, Array.geom(8, 50, 1.5), 1/4).sum, 80, 5.85, 0.41, 0.19, 15, -3.dbamp, -5.dbamp, -5.dbamp, 180, 1) * 0.05}
~outM = {Limiter.ar(~outS + ~outD)};
~outM.play;

~out = ~sin;

s.meter

~sin = {Pan2.ar(PMOsc.ar(40*[1, 1.01], 400, XLine.kr(0.1, 50, 0.75), 0, 0.125))*EnvGen.kr(Env.perc, doneAction: Done.freeSelf)}

~sin = {Pan2.ar(PMOsc.ar(40*[1, 1.001], 400, XLine.kr(0.1, 50, 0.75), 0, 0.125))*EnvGen.kr(Env.perc, doneAction: Done.freeSelf)}