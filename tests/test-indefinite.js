var assert = require('assert');
var cd1 = new (require('../lib/countdown.js'))(2, {indefinite: true});

assert.equal(cd1.indefinite, true);

cd1.on('indefinite', function(err, dn) {
  assert.notEqual(typeof cd1._indefinite, 'undefined');
})
cd1.signal();

setTimeout(function() {
  assert.equal(cd1.completed, false);
}, 1000);

setTimeout(function() {
  assert.equal(cd1.completed, false);
  cd1.signal(cd1.total); //
}, 5000);