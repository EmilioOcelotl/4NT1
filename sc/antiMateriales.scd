//// Materiales 4NT1 /////

p = ProxySpace.push(s.boot);
p.makeTempoClock((140/120));
p.quant = 4;
PirE.loadSamples();

~outS = {DelayC.ar(~out.ar*1, 0.01, 0.0006*0.75) * EnvFollow.ar(~out.ar*1, 1 - (0.0006 * SampleRate.ir).reciprocal).max(0.174377).reciprocal *0.5!2}; // para las otras rolas está a 0.2
~outD = {GVerb.ar(BPF.ar(~out, Array.geom(8, 50, 1.5), 1/4).sum, 80, 5.85, 0.41, 0.19, 15, -3.dbamp, -5.dbamp, -5.dbamp, 180, 1) * 0.2}
~outM = {Limiter.ar(~outS + ~outD)};
~outM.play;


s.meter

~out = ~buf1;

(

~demaGen = {Demand.kr(Impulse.kr(~tempo), 0, Dseq([4, 2, 15, 2, 4, 6]*0.125, inf)) * ~tempo};

~dema1 = {Lag.kr(Demand.kr(~demaGen*2, 0, Drand(Array.rand(12, 0, 0.99999), inf)), 0.5)};

//~mezcla =  ~pepehi + ~buf3 + ~pepeclap + ~pepes;
~buf1 = {Pan2.ar(PlayBuf.ar(2, PirE.a[0], BufRateScale.kr(PirE.a[0]) * Demand.kr(Impulse.kr(~demaGen*8),0,Drand([ -0.5, -1, -2, -1, 1, 0.5, -0.125]*[0.45, 0.451],inf)), Impulse.kr(~demaGen *Demand.kr(~demaGen*8,0,Drand([2, 1, 4, 2.5]*(2),inf))*1), BufFrames.kr(PirE.a[0])*~dema1)).clip2(0.1) * 1};

)

~out.play

s.meter