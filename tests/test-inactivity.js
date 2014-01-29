var assert = require('assert');
var cd1 = new (require('../lib/countdown.js'))(2, {inactivity: 2000});
var cd2 = new (require('../lib/countdown.js'))(2, {inactivity: 2000});

var cd1_completed = false;
var cd2_completed = false;
var cd1_inactivity = false;
var cd2_inactivity = false;


//
//  attempt 1, should time out
//
cd1.on('inactivity', function(err) {
  cd1_inactivity = true;
});
cd1.on('complete', function(err, msg, shat) {
  cd1_completed = true;
});
cd1.signal();
setTimeout(cd1.signal.bind(cd1), 2500);


//
//  attempt 2, shouldn't time out
//
cd2.on('inactivity', function(err) {
  cd2_inactivity = true;
});
cd2.on('complete', function(err, msg, shat) {
  cd2_completed = true;
});
cd2.signal();
setTimeout(cd2.signal.bind(cd2), 1000);


setTimeout(function(){
  assert.equal(cd1_completed, true);
  assert.equal(cd2_completed, true);
  assert.equal(cd1_inactivity, true);
  assert.equal(cd2_inactivity, false);
  process.kill(process.pid);
}, 5000);