/////////////////////////////////
//////////// 4NT1 ///////////////
/////////////////////////////////

n = NetAddr( "127.0.0.1", 1234 ); // local machine
OSCdef(\test, {|msg, time, addr, recvPort| msg.postln}, '/test', n); // def style
