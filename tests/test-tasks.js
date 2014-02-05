var assert = require('assert');
var donedone = require('../lib/countdown.js');

var db_initialized = false;
var other_initialized = false;

var cd1 = new donedone(1);
var cdDBInit = new donedone(1);
var cdOtherInit = new donedone(1);
cd1.on('complete', function() {
  assert.equal(db_initialized, true);
  assert.equal(other_initialized, true);
});
cdDBInit.on('complete', function(err, id) {
  db_initialized = true;
});
cdOtherInit.on('complete', function(err, id) {
  other_initialized = true;
});

cd1.addSubTask('dbinit', cdDBInit);
setTimeout(function() {
  cdDBInit.signal();
}, 1337);

cd1.addSubTask('otherinit', cdOtherInit);
setTimeout(function() {
  cdOtherInit.signal();
}, 2500);

cd1.signal();
