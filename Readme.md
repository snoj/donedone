# donedone

Donedone is for when complex chains or an unknown number of events need to be completed. It is inspired by the C# System.Threading.CountdownEvent class.

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

## Assign subtasks for specific resources

```
var donedone = require('donedone');

var cd1 = new donedone(1);
var cbdbinit = new donedone(1);
var cdotherinit = new donedone(1);
cd1.on('complete', function() {
  //start doing awesome things
});

cd1.addSubTask('dbinit', cbdbinit);
setTimeout(function() {
  cbdbinit.signal();
}, 1337);

cd1.addSubTask('otherinit', cdotherinit);
setTimeout(function() {
  cdotherinit.signal();
}, 2500);

cd1.signal();

```

# Constructor(total [, flags])

Create a new donedone instance.

```
{
  timeout: int|milliseconds
  ,inactivity: int|milliseconds
  ,indefinite: boolean //default is true
}
```

# Methods

## add(count || 1)

Increment the total number of signals that need to be completed. If no count is specified, 1 is used.

## signal(count || 1)

Signal that something has completed. If no count is specified, 1 is used.

# Events

## complete(err, donedoneObject)

Fired when the total (new donedone() or dd.add()) is equal to or greater than the count (dd.signal()) for self and all subtasks.

## signal(err, count, total, donedoneObject)

Fired whenever dd.signal() is called.

## timeout(err);

This event will fire if donedone is not completed within the N milliseconds specified.

## inactivity(err)

Inactivity fires if no dd.signal() has been called in N milliseconds.

## indefinite(err, timestamp)

Indefinite fires whenever the internal indefinite callback is executed and schedules itself to run again.

```
var dd = new (require('donedone'))(1);
dd.on('indefinite', function(err, timestamp) {
  console.log('Indefintely waiting:', (new Date(timestamp)).toString());
});
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
