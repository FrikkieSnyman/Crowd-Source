/*
dependancies
 */
var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config');
var mongoose = require('mongoose');
var jwt = require('express-jwt');

// Check testing environment
// process.env.CUSTOM_COV ?
// 	console.log('test environemnt')
// 	: 
// 	console.log('normal env');
console.log(process.env.NODE_ENV);
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
var serverCreated = function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Listening at http:localhost//%s:%s', host, port);
};

var server = app.listen(config.port, serverCreated);
/*
setup mongoose
- We will always use the same database connection when interfacing with the database.
 */
mongoose.connect(config.mongodb.uri);
app.db = mongoose.connection;
app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
app.db.once('open', function() {
	//and... we have a data store
	console.log('Connected to database');
});
/*
Add database schmes
 */
require('./models.js')(app, mongoose);

/*
middleware
 */
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));

app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

/*
public directory
 */
app.use(express.static(__dirname + '/www'));

/*
setup routes
-We express app to the routes so that we can use express there.
 */
require('./routes')(app, mongoose);

exports.app = function() {
	return app;
};

exports.server = function() {
	return server;
};

exports.mongoose = function() {
	return mongoose;
};