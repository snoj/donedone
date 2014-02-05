
var $ = module.exports = function(total, flags) {
  flags = flags || {};
  this._total = (function() {
    if(Number.isNaN(parseInt(total))) return 0;
    return parseInt(total);
  })();
  this.timeout = (function() {
    if(Number.isNaN(parseInt(flags.timeout))) return 0;
    return parseInt(flags.timeout);
  })();
  this.inactivity = (function() {
    if(Number.isNaN(parseInt(flags.inactivity))) return 0;
    return parseInt(flags.inactivity);
  })();
  this.indefinite = (function() {
    if(typeof flags.indefinite == 'string') {
      try { return JSON.parse(flags.indefinite.toLowerCase()); }
      catch(e) { return false; }
    } else if(typeof flags.indefinite == 'boolean') { return flags.indefinite; }
    return true;
  })();

  this._count = 0;
  this.jobs = {};

  Object.defineProperty(this, "completed", {get: (function() { return !((this._total - this._count) > 0)}).bind(this)});
  Object.defineProperty(this, "count", {get: (function() {
    var self = this;
    var childCount = 0;

    Object.keys(self.jobs).forEach(function(v) { childCount += self.jobs[v].count; })

    return this._count + childCount;
  }).bind(this)});
  Object.defineProperty(this, "total", {get: (function() {
    var self = this;
    var childCount = 0;

    Object.keys(self.jobs).forEach(function(v) { childCount += self.jobs[v].total; })

    return this._total + childCount;
  }).bind(this)});

  if(this.timeout > 0) this._timer = setTimeout(this._outoftime.bind(this, 'timeout'), this.timeout);
  if(this.inactivity > 0) this._resetTimer();
  if(this.indefinite == true) this._indefinite = setTimeout(this._indefinitecb.bind(this), 1000);
};

require('util').inherits($, require("events").EventEmitter);


$.prototype._resetTimer = function() {
  if(this._inactivity) clearTimeout(this._inactivity);
  if(this.inactivity > 0) this._inactivity = setTimeout(this._outoftime.bind(this, 'inactivity'), this.inactivity);
}
$.prototype._clearTimer = function() {
  if(this._timer) clearTimeout(this._timer);
  if(this._inactivity) clearTimeout(this._inactivity);
  if(this._indefinite) clearTimeout(this._indefinite);
}
$.prototype._outoftime = function(cause) {
  this.emit(cause, '['+ cause +' reached]');
}
$.prototype._indefinitecb = function() {
  if(!this.completed) {
    this.emit('indefinite', null, Date.now())
    this._indefinite = setTimeout(this._indefinitecb.bind(this), 1000);
  }
}

$.prototype.add = function(count) {
  count = (function() {
    if(Number.isNaN(parseInt(count))) return 1;
    return parseInt(count);
  })();
  this._total += count;
};

$.prototype.addSubTask = function(id, subtask) {
  if(!(subtask instanceof $)) this.emit('error', '[donedone.addSubTask: subtask is not a donedone object]');

  this.jobs[id] = subtask;
  this.jobs[id].on('complete', this._end.bind(this));
}

$.prototype.signal = function(count) {
  count = count || 1;
  this._count += count;
  this._resetTimer();

  this.emit('signal', null, this.count, this.total, this);
  this._end();
};

$.prototype._end = function() {
  if(!(this.count < this.total)) {
    if(this._timer) clearTimeout(this._timer);
    this._clearTimer();

    this.emit('complete', null, this);
  }
}
