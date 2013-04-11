#!/usr/bin/env node

var http = require('http'),
 fs = require('fs'),
 path = require('path'),
 express = require('express'),
 lw = require('./logwatcher.js');

var app = express();

var configFile = path.normalize(path.join(process.env.HOME, '.logwatchrc'));
var config = {};

if (fs.existsSync(configFile)) {
  console.log('Config file found.');

  config = JSON.parse(fs.readFileSync(configFile, 'utf8')) || config;
} else {
  console.log('~/.logwatchrc file not found. LogWatcher cannot be started.');
  return;
}

app.set('views', __dirname + '/../views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.use(express.static(__dirname + '/../public'));

app.get('/', function (req, res) {
  res.render('index', {
    title: 'LogWatcher on ' + require('os').hostname(),
    logs: config.logs
  });
});

var server = http.createServer(app);

for (var logName in config.logs) {
  lw.createLogWatcher(server, logName, config.logs[logName]);
}

if (!config.port) {
  config.port = 4000;
}

server.listen(config.port);
console.log('HTTP server listening on port: ' + config.port);
