var fs = require('fs'),
    path = '/home/wwang/test.log',
    i = -1;

setInterval(function () {
  i++;

  if (i === 0) {
    fs.appendFileSync(path, 'file created\n');
  } else if (i < 2) {
    fs.appendFileSync(path, 'testing... ' + i + '\n');
  } else {
    i = -1;
    fs.unlinkSync(path);
  }
}, 2000);

