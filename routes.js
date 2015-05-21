/**
 * We will do all our routing in this file. 
 *   app.get('/admin/users/', require('./public/index').find);
 *   This means that wen a route is called it will go look for it in the relevant layout
 *   This will be index.js file that exports a function.
 */




exports = module.exports = function(app) {
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
	};