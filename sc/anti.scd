/////////////////////////////////
//////////// 4NT1 ///////////////
/////////////////////////////////

p = ProxySpace.push(s.boot);

(
OSCdef(\kpx, {|msg, time, addr, recvPort| msg.postln}, '/kpx', nil);
OSCdef(\kpy, {|msg, time, addr, recvPort| msg.postln}, '/kpy', nil);
OSCdef(\kpz, {|msg, time, addr, recvPort| msg.postln}, '/kpz', nil);
)