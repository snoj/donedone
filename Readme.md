# donedone

Downdown is for when complex chains or an unknown number of events need to be completed. It is inspired by the C# System.Threading.CountdownEvent class.

# Usage

## Processing of unknown number of data points

```
var donedone = require('donedone');

var num_jobs = 5

//add one for the "job" of queueing all the other jobs.
var countdown = new donedone(num_jobs+1);
countdown.on("complete", function(err, _countdown) {
  console.log("donedone!");
  console.log("%s events completed", _countdown.total);
});
countdown.on("signal", function() {
  //Whoops, we forgot some things
  if(countdown.total > 1000 && countdown.total < 1020) {
    countdown.add();
    countdown.signal();
  }
});

for(var i = 0; i < num_jobs; i++) {
  //add some more things to do.
  for(var j = 0; j < 5000; j++) {
    countdown.add();
    //do something awesome
    countdown.signal();
  }
  countdown.signal();
}

countdown.signal();
```

## Initialization of resources

```
var donedone = require('donedone');

var cd1 = new donedone(1);
cd1.on('complete', function() {
  //start doing awesome things
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

```

# License

(The MIT License)

Copyright (c) 2014 Josh Erickson &lt;josh@snoj.us&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
