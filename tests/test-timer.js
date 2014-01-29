var assert = require('assert');
var cd1 = new (require('../lib/countdown.js'))(2, {timeout: 2000});
var cd2 = new (require('../lib/countdown.js'))(2, {timeout: 2000});

var cd1_completed = false;
var cd2_completed = false;
var cd1_timeout = false;
var cd2_timeout = false;


//
//  attempt 1, should time out
//
cd1.on('timeout', function(err) {
  cd1_timeout = true;
});
cd1.on('complete', function(err, msg, shat) {
  cd1_completed = true;
});
cd1.signal();
setTimeout(cd1.signal.bind(cd1), 4000);


//
//  attempt 2, shouldn't time out
//
cd2.on('timeout', function(err) {
  cd2_timeout = true;
});
cd2.on('complete', function(err, msg, shat) {
  cd2_completed = true;
});
cd2.signal();
setTimeout(cd2.signal.bind(cd2), 1000);


setTimeout(function(){
  assert.equal(cd1.completed, false);
  assert.equal(cd2.completed, true);
  assert.equal(cd1_timeout, true);
  assert.equal(cd2_timeout, false);
  process.kill(process.pid);
}, 2500);
