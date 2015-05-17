var express = require('express');
var app = express();
var ejs = require('ejs');
var path = require('path');

var PORT = process.env.PORT || 8080;

// view engine setup
app.engine('html', ejs.renderFile);
app.set('www', path.join(__dirname, 'www'));
app.set('www engine', 'html');

// serve an empty page that just loads the browserify bundle
app.get('/', function(req, res) {
res.render('home');
});

app.listen(PORT);
console.log('server started on port %s', PORT);