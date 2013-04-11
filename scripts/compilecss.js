var fs = require('fs'),
  stylus = require('stylus');

var styles = fs.readFileSync(__dirname + '/../views/stylesheets/style.styl', {
  encoding: 'utf8'
});

var outputPath = __dirname + '/../public/stylesheets/style.css';

stylus.render(styles, {
  filename: outputPath 
}, function (err, css) {
  if (err) throw err;
  fs.writeFileSync(outputPath, css);
  console.log('Successfully compiled style.css.');
});
