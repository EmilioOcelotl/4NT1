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

(

~sweep = {LFSaw.ar(Demand.kr(Impulse.kr(~tempo*0.125/4), 0, Dseq([~tempo*0.125/4], inf))).exprange(10, 15000)};

~nota = {Demand.kr(Impulse.kr(~tempo*0.125/4), 0, Dseq((Scale.hirajoshi.degrees + 57).midicps*0.125, inf))};
~notasin = {Demand.kr(Impulse.kr(~tempo*~demaTempoSin), 0, Drand((Scale.hirajoshi.degrees + 57).midicps, inf))};

~nota2 = {Demand.kr(Impulse.kr(~tempo*0.125), 0, Drand(Array.rand(20, 30,500), inf))};
~nota3 = {Lag.kr(Demand.kr(Impulse.kr(~tempo*0.125), 0, Drand(Array.rand(20, 0.05, 30), inf)), 0.5)};


~sonFin = {Pan2.ar(LPF.ar(LFSaw.ar(~nota * [0.999, 1.001]).mean * 0.2, ~sweep))};

~demaTempoSin = {Lag.kr(Demand.kr(Impulse.kr(~tempo*1), 0, Drand([2.5, 1, 1.5, 0.5, 5, 6, 8, 10]/2, inf)), 0.5)};

~sin = {Pan2.ar(SinOsc.ar(~notasin* [1.999, 2.001], 0, 0.1) * Decay.kr(Demand.kr(Impulse.kr(~tempo*~demaTempoSin), 0, Drand([0.45, 1, 0.2, 0.7, 0.8], inf)) * Impulse.kr(~tempo*~demaTempoSin), 0.15)).fold2(0.1)};

~filtro = {Lag.kr(Demand.kr(Impulse.kr(~tempo*0.125, 1.5), 0, Drand(Array.rand(20, 100, 5500), inf)), 10)};

~crack = {LPF.ar(Crackle.ar(1.95, 0.25),  ~filtro)};

~dema = {Lag.kr(Demand.kr(Impulse.kr(~tempo*0.25), 0, Dseq(Array.rand(20, 0, 0.99999), inf)), 8)};
~dema2 = {Lag.kr(Demand.kr(Impulse.kr(~tempo*0.125), 0, Drand([0.5, 1, 2, -1, -2, 0, 0], inf)), 8)};

~wpA1 = {arg amp = 1; (Pan2.ar(Warp1.ar(1, i, ~dema, ~dema2*[2.1, 1,1.1, 2], 0.1, -1, 8, 0.5, 4))) * amp};


)

Scale.hirajoshi.degrees + 60.midicps
Scale.names

~out.fadeTime = 10

~out  =  ~crack
~out  =  ~wpA1
~out  =  ~wpA1 + ~crack + ~sonFin + ~sin


~out.free
~out.play

s.meter
