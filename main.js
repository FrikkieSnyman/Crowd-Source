/*
dependancies
 */
var express = require('express'),
	bodyParser = require('body-parser'),
	config = require('./config');
/*
Create express app
 */
var app = express();

/*
Keep reference to config
- We will use this to configure the server.
 */
app.config = config;

/*
Setup the web server
 */
var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

/*
middleware
 */
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

/*
public directory
 */
app.use(express.static(__dirname + '/public'));

/*
setu routes
 */
require('./routes')(app);

/*
dummy data
 */
var names = ["Hanrich","Frikkie","Hugo","Andre","Isabel"];



exports.square = function (r,callback) {
  callback(r * r);
};
