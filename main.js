var express = require('express');
var app = express();

app.use(express.static(__dirname + '/www'));

app.get('/', function (req, res) {
  fs.readFile(__dirname + '/www/index.html', 'utf8', function(err, text){
        res.send(text);
    });
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
