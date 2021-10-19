p = ProxySpace.push(s.boot);
// Esperar poquito
s.scope;
s.meter;
//
p.makeTempoClock((140/120));
p.quant = 4;
PirE.loadSamples();
// Esperar poquito

i = Buffer.read(s, "/home/emi/Música/4NT1/uxmal.wav");
o = Buffer.read(s, "/home/emi/muestras/808/kick__2_.wav");
q = Buffer.read(s, "/home/emi/muestras/808/snare__26_.wav");



~outS = {DelayC.ar(~out.ar*1, 0.01, 0.0006*0.75) * EnvFollow.ar(~out.ar*1, 1 - (0.0006 * SampleRate.ir).reciprocal).max(0.174377).reciprocal *0.5!2}; // para las otras rolas está a 0.2
~outD = {GVerb.ar(BPF.ar(~out, Array.geom(8, 50, 1.5), 1/4).sum, 80, 5.85, 0.41, 0.19, 15, -3.dbamp, -5.dbamp, -5.dbamp, 180, 1) * 0.05}
~outM = {Limiter.ar(~outS + ~outD)};
~outM.play;

(
~sweep = {LFSaw.ar(Demand.kr(Impulse.kr(~tempo*~demaTempoSin*0.125/4), 0, Drand([~demaTempoSin*0.125/4], inf))).exprange(10, 15000)};

~nota = {Demand.kr(Impulse.kr(~tempo*~demaTempoSin*0.125/4), 0, Dseq((Scale.hirajoshi.degrees + 60).midicps*0.125/2, inf))};
~notasin = {Demand.kr(Impulse.kr(~tempo*~demaTempoSin), 0, Drand((Scale.hirajoshi.degrees.reverse.pyramid + 60).midicps, inf))};

~nota2 = {Demand.kr(Impulse.kr(~tempo*0.125), 0, Drand(Array.rand(20, 30,500), inf))};
~nota3 = {Lag.kr(Demand.kr(Impulse.kr(~tempo*0.125), 0, Drand(Array.rand(20, 0.05, 30), inf)), 0.5)};

~sonFin = {Pan2.ar(LPF.ar(LFSaw.ar(~nota * [0.999, 1.001]).mean * 0.2, ~sweep))};

~demaTempoSin = {Lag.kr(Demand.kr(Impulse.kr(~tempo), 0, Dseq([10, 2, 6]*0.5, inf)), 2)};

~sin = {Pan2.ar(SinOsc.ar(~notasin* [3.999, 4.001]/2, 0, 0.4) * Decay.kr(Demand.kr(Impulse.kr(~tempo*1), 0, Dseq([0, 0, 0.25, 0, 0.25, 0, 0].pyramid, inf)) * Impulse.kr(~tempo*~demaTempoSin), 0.1)).fold2(0.1) * 1.5};

~filtro = {Lag.kr(Demand.kr(Impulse.kr(~tempo*0.125, 1.5), 0, Drand(Array.rand(20, 100, 2500), inf)), 10)};

~crack = {LPF.ar(Crackle.ar(1.95, 0.5),  ~filtro)};

~dema = {Lag.kr(Demand.kr(Impulse.kr(~tempo*0.25), 0, Dseq(Array.rand(20, 0, 0.99999), inf)), 4)};
~dema2 = {Lag.kr(Demand.kr(Impulse.kr(~demaTempoSin/32), 0, Drand([0.5, 1], inf)), 8)};
~dema3 = {Lag.kr(Demand.kr(Impulse.kr(~tempo*0.125), 0, Drand(Array.rand(8, 0.0, 1.0), inf)), 4)};

~wpA1 = {arg amp = 1; (Pan2.ar(Warp1.ar(1, i, ~dema, ~dema2*[2.1, 1,1.1, 2], 0.1, -1, 8, ~dema3, 4))) * amp};

~demapos = {Demand.kr(Impulse.kr(~tempo*1), 0, Drand([0.25, 0.5], inf))};
~demabuf = {Demand.kr(Impulse.kr(~demaTempoSin*0.5), 0, Dxrand([2, 4, 8, 2]/16, inf))};

~pepes = {Pan2.ar(PlayBuf.ar(1, o, BufRateScale.kr(o) * Demand.kr(Impulse.kr(~demaTempoSin), 0, Drand([1], inf)), Impulse.kr(~demaTempoSin * Demand.kr(Impulse.kr(~demaTempoSin/2), 0, Drand([2, 5, 4, 10, 4]*0.25/8, inf))), 0, 0)) * 0.2};

~pepeclap = {Pan2.ar(PlayBuf.ar(1, q, BufRateScale.kr(q) * Lag.kr(Demand.kr(Impulse.kr(~demaTempoSin*0.125/2), 0, Drand([1, 0.125].reverse, inf)), 8), Impulse.kr(~demaTempoSin * Demand.kr(Impulse.kr(~demaTempoSin/4), 0, Dseq([ 2, 5, 16, 10, 4] * 0.125*[0.5, 0.1], inf)), 0.5), 0, 0)) * 0.2};

~out  =  ~pepes + ~pepeclap

)

Scale.hirajoshi.degrees + 60.midicps
Scale.names

~out.fadeTime = 0


~out  =  ~wpA1  + ~pepes

~out  =  ~wpA1  + ~pepes + ~pepeclap

~out  =  ~wpA1  + ~sin + ~pepes + ~pepeclap

~out  =  ~wpA1 + ~sonFin + ~sin + ~pepes + ~pepeclap



~out.free
~out.play

s.meter
