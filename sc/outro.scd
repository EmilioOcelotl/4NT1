p = ProxySpace.push(s.boot);
// Esperar poquito
s.scope;
s.meter;
//
p.makeTempoClock((90/120));
p.quant = 4;
PirE.loadSamples();
// Esperar poquito

i = Buffer.read(s, "/home/emi/Descargas/398808__inspectorj__bubbling-large-a.wav");

i = Buffer.read(s, "/home/emi/Música/4NT1/uxmal.wav");

o = Buffer.read(s, "/home/emi/muestras/808/kick__2_.wav");
q = Buffer.read(s, "/home/emi/muestras/808/snare__26_.wav");


~outS = {DelayC.ar(~out.ar*1, 0.01, 0.0006*0.75) * EnvFollow.ar(~out.ar*1, 1 - (0.0006 * SampleRate.ir).reciprocal).max(0.174377).reciprocal *0.5!2}; // para las otras rolas está a 0.2
~outD = {GVerb.ar(BPF.ar(~out, Array.geom(8, 50, 1.5), 1/4).sum, 80, 5.85, 0.41, 0.19, 15, -3.dbamp, -5.dbamp, -5.dbamp, 180, 1) * 0.05}
~outM = {Limiter.ar(~outS + ~outD)};
~outM.play;
s.meter
(
~sweep = {LFSaw.ar(Demand.kr(Impulse.kr(~tempo*~demaTempoSin*0.125/4), 0, Drand([~demaTempoSin*0.125/4], inf))).exprange(10, 15000)};

~nota = {Demand.kr(Impulse.kr(~tempo*~demaTempoSin*0.125/4), 0, Dseq((Scale.hirajoshi.degrees + 60).midicps*0.125/2, inf))};
~notasin = {Demand.kr(Impulse.kr(~tempo*~demaTempoSin2), 0, Drand((Scale.hirajoshi.degrees.reverse.pyramid + 60).midicps, inf))};

~nota2 = {Demand.kr(Impulse.kr(~tempo*0.125), 0, Drand(Array.rand(20, 30,500), inf))};
~nota3 = {Lag.kr(Demand.kr(Impulse.kr(~tempo*0.125), 0, Drand(Array.rand(20, 0.05, 30), inf)), 0.5)};

~sonFin = {Pan2.ar(LPF.ar(LFSaw.ar(~nota * [0.9, 1.1]).mean * 0.2, ~sweep))};

~demaTempoSin = {Lag.kr(Demand.kr(Impulse.kr(~tempo*0.5), 0, Dseq([4]*0.5, inf)), 2)};
~demaTempoSin2 = {Lag.kr(Demand.kr(Impulse.kr(~tempo), 0, Dseq([10, 2, 6, 4, 10, 2, 6, 4, 10, 2, 6, 4, 10, 2, 6, 4, 0]*1, 1)), 2)};

~sin = {Pan2.ar(SinOsc.ar(~notasin* 8/2, 0, 0.2) * Decay.kr(Demand.kr(Impulse.kr(~tempo*~demaTempoSin2), 0, Dseq([0.5], inf)) * Impulse.kr(~tempo*~demaTempoSin2*[1, 0.5]), 0.15)).fold2(0.1) * 0.2};

~filtro = {Lag.kr(Demand.kr(Impulse.kr(~tempo*0.125, 1.5), 0, Drand(Array.rand(20, 100, 2500), inf)), 10)};

~crack = {LPF.ar(Crackle.ar(1.95, 0.5),  ~filtro)};


~dema = {Lag.kr(Demand.kr(Impulse.kr(~tempo*1), 0, Dseq(Array.rand(20, 0, 0.99999), inf)), 6)};

~dema2 = {Lag.kr(Demand.kr(Impulse.kr(~tempo*1), 0, Dseq(Array.rand(20, 0, 0.99999), inf)), 6)};

~dema2 = {Lag.kr(Demand.kr(Impulse.kr(~demaTempoSin/2), 0, Dseq([0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0]*(-0.5), 1)), 8)};
~dema3 = {Lag.kr(Demand.kr(Impulse.kr(~tempo*0.5), 0, Drand(Array.rand(8, 0.0, 1.0), inf)), 4)};

~wpA1 = {arg amp = 0.25; (Pan2.ar(Warp1.ar(1, i, Line.kr(0.9, 0.15, 60), Line.kr(8, 0.25, 60)*[2.01, 1, 1.01, 2], 0.25, -1, ~tempo*Line.kr(12, 0.1, 60), XLine.kr(0.01, 1, 60), 4))*2) * amp};



~dema3 = {Lag.kr(Demand.kr(Impulse.kr(~tempo*0.5), 0, Drand(Array.rand(8, 0.1, 1.0), inf)), 4)};

~demapos = {Demand.kr(Impulse.kr(~tempo*1), 0, Drand([0.25, 0.5], inf))};
~demabuf = {Demand.kr(Impulse.kr(~demaTempoSin*0.5), 0, Dxrand([2, 4, 8, 2]/16, inf))};

~pepes = {Pan2.ar(PlayBuf.ar(1, o, BufRateScale.kr(o) * Demand.kr(Impulse.kr(~demaTempoSin/2), 0, Drand([1, 1, 1, 1]*0.5, 1)), Impulse.kr(~demaTempoSin * Demand.kr(Impulse.kr(~demaTempoSin/2), 0, Dseq([8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 0]*0.5/8, 1))), 0, 0)) * 0.1};

~pepeclap = {Pan2.ar(PlayBuf.ar(1, q, BufRateScale.kr(q) * Demand.kr(Impulse.kr(~demaTempoSin*0.125/2), 0, Drand([0.5].reverse, inf)), Impulse.kr(~demaTempoSin * Demand.kr(Impulse.kr(~demaTempoSin/2), 0, Dseq([ 1, 1, 1, 1, 1, 1, 1, 1,1, 1, 1, 1, 1, 1, 1, 1, 0] *0.25, 1)), 1.47), 0, 0)) * 0.15};

 ~out  = ~wpA1;

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
