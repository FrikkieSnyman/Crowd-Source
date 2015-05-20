
//===========================
// This is how our server 
// will be managed. 
// Ask Hanrich for details
//
//===========================
var express = require('express');
var app = express();
//===========================
// Default directory to
// server pages an dependacys from
// Already working
// Try it out npm start
// localhost........
// you know the drill
//===========================
app.use(express.static(__dirname + '/www'));

var names = ["Hanrich","Frikkie","Hugo","Andre","Isabel"];
//===========================
//Very important parser NB!
//===========================
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.get('/', function (req, res) {
	// We only need to provide the client with the index page. 
	// The rest will happen automatically. 
	// We will only implement the GET/POST 
  fs.readFile(__dirname + '/www/index.html', 'utf8', function(err, text){
        res.send(text);
    });
});

app.get('/names',function(request,response){
	console.log("Client asked me for information");
	response.send(names);
});

app.post('/name', function(request, response) {
	console.log("Client is adding name " + request.body.name);
	names.push(request.body.name);
	response.send(true);
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
