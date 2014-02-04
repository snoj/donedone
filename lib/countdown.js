
var $ = module.exports = function(total, flags) {
  flags = flags || {};
  this.total = (function() {
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
  })()

  this.count = 0;
  this.jobs = {};

  Object.defineProperty(this, "completed", {get: (function() { return !((this.total - this.count) > 0)}).bind(this)});

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
  //if(typeof count == 'undefined' || count == null) count = 1;
  count = (function() {
    if(Number.isNaN(parseInt(count))) return 1;
    return parseInt(count);
  })();
  this.total += count;
};

$.prototype.addSubTask = function(id, count) {
  //rewrite to use this prototype recusively
  if(typeof this.jobs[id] == 'undefined') {
    this.jobs[id] = {total: (count || 1), count: 0};
  } else {
    this.jobs[id].total += count;
  }
  this.add(count);
}

$.prototype.signal = function(count) {
  count = count || 1;
  this.count += count;
  this._resetTimer();

  this.emit('signal', null, this.count, this.total, this);
  if(!(this.count < this.total || this._countjobsdiff() > 0)) {
    if(this._timer) clearTimeout(this._timer);
    this._clearTimer();

    this.emit('complete', null, this);
  }
};

$.prototype.signalSubTask = function(id, count) {
  count = count || 1;
  if(typeof this.jobs[id] != 'undefined') {
    this.jobs[id].count += count;

    if(this.jobs[id].count < this.jobs[id].total)
      this.emit('subtasksignal', null, id, this.jobs[id].count, this.jobs[id].total, this);
    else
      this.emit('subtaskcomplete', null, id, this.jobs[id].count, this.jobs[id].total, this);
    this.signal(count);
  } else {
    this.emit('error', "[signalSubJob: no job by the id of "+ id +"]");
  }
}

$.prototype._countjobs = function() {
  var r = {total: 0, count: 0};
  for(var i in this.jobs) {
    r.total += this.jobs[i].total;
    r.count += this.jobs[i].count;
  }
  return r;
};

$.prototype._countjobsdiff = function() {
  var t = this._countjobs();
  return t.total - t.count;
};
