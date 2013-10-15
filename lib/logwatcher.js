var events = require('events');
var util = require('util');
var fs = require('fs');
var WebSocketServer = require('ws').Server;

function LogWatcher(httpServer, name, path) {
  events.EventEmitter.call(this);
  this.name = name.replace(' ', '', 'g');
  this.path = path;

  this.watch();
  this.startWebSocketServer(httpServer);
}

util.inherits(LogWatcher, events.EventEmitter);

LogWatcher.prototype.startWebSocketServer = function (httpServer) {
  var lw = this;

  console.log('WebSocketServer started for log: ' + this.name);
  
  this.wss = new WebSocketServer({
    server: httpServer,
    path: '/logs/' + this.name
  });

  this.wss.on('connection', function (ws) {
    console.log('A WebSockets connection was made to log: ' + lw.name);
    lw._sendLines(ws);
  });
};

LogWatcher.prototype._sendLines = function (ws) {
  var lw = this;

  function sendLine(line) {
    ws.send(line);
  }
  
  // first send existing lines
  // data.split('\n').forEach(sendLine);
  
  lw.on('newline', sendLine);

  ws.on('close', function () {
    console.log('A WebSockets connection was closed for: ' + lw.name);
    lw.removeListener('newline', sendLine);
  });
};
  
LogWatcher.prototype.watch = function () {
  console.log('Starting LogWatcher on: ' + this.name);
  this._watch();
};

LogWatcher.prototype._watch = function () {
  var lw = this;
  
  if (!fs.existsSync(this.path)) {
    console.log('File not found: (' + this.path + '). Trying again...');
    this._watching = false;
    return setTimeout(function () {
      lw._watching || lw._watch();
    }, 1000);
  }

  this._watching = true;

  var currentSize = fs.statSync(this.path).size;

  if (this._watcher) {
    this._watcher.close();
  }

  console.log('Now watching file: ' + this.path);
  this._watcher = fs.watch(this.path, function (event) {
    if (event === 'rename') {
      // looks like a new log file was created
      console.log('Log file renamed.');
      lw._watcher.close();
      return lw._watch();
    }

    fs.stat(lw.path, function (err, stat) {
      if (err) {
        console.log('The file: ' + lw.path + ' seems to have been deleted.');
        lw._watcher.close();
        return lw._watch();
      }

      lw._readNewLines(stat.size, currentSize);
      currentSize = stat.size;
    });
  });
};

LogWatcher.prototype._readNewLines = function (newSize, oldSize) {
  if (newSize < oldSize) return;

  var stream = fs.createReadStream(this.path, {
    encoding: 'utf8',
    start: oldSize,
    end: newSize
  });

  var lw = this;
  stream.on('data', function (data) {
    var lines = data.split('\n');

    lines.forEach(function (line) {
      lw.emit('newline', line);
    });
  });
};

exports.createLogWatcher = function (httpServer, name, path) {
  return new LogWatcher(httpServer, name, path);
};
