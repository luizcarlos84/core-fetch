exports.webSrv = (port) => {
  var http = require('http');

  http.createServer(function (req, res) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write('<p>Investigador em funcionamento as ' + time + '</p>');
      res.end();
  }).listen(port);
}
