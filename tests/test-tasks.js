var assert = require('assert');
var donedone = require('../lib/countdown.js');

var db_initialized = false;
var other_initialized = false;

var cd1 = new donedone(1);
cd1.on('complete', function() {
  assert.equal(db_initialized, true);
  assert.equal(other_initialized, true);
}).on('subtaskcomplete', function(err, id) {
  if(id == 'dbinit') db_initialized = true;
  if(id == 'otherinit') other_initialized = true;
});

cd1.addSubTask('dbinit');
setTimeout(function() {
  cd1.signalSubTask('dbinit');
}, 1337);

cd1.addSubTask('otherinit');
setTimeout(function() {
  cd1.signalSubTask('otherinit');
}, 2500);

cd1.signal();
