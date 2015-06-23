/**
 * We will do all our routing in this file.
 *   app.get('/admin/users/', require('./public/index').find);
 *   This means that wen a route is called it will go look for it in the relevant layout
 *   This will be index.js file that exports a function.
 */

var names = ['Hanrich', 'Frikkie', 'Hugo', 'Andre', 'Isabel'];

exports = module.exports = function(app, mongoose) {
	app.get('/', function(req, res) {
		// We only need to provide the client with the index page.
		// The rest will happen automatically.
		// We will only implement the GET/POST
		fs.readFile(__dirname + '/www/index.html', 'utf8', function(err, text) {
			res.send(text);
		});
	});
	/**
	 * A very simple example of how to work with our files. Now our sepeartion of concerns
	 * is looking great.
	 */

	/**
	 * UserManagment
	 */
	var usermanagement = require('./lib/usermanagement/usermanagement.js')(app, mongoose);
	console.log(usermanagement.addName);
	app.get('/names', usermanagement.getNames);
	app.post('/name', usermanagement.addName);
	app.post('/login', usermanagement.login);
	app.get('/me', ensureAuthorized, usermanagement.getDetails);

	var project = require('./lib/project/project.js')(app, mongoose);
	app.get('/projects', project.getAllProjects);
	app.post('/createProject', project.createProject);
	app.post('/project', project.getProject);
	app.post('/addChild', project.addChild);
};

function ensureAuthorized(req, res, next) {
	var bearerToken;
	var bearerHeader = req.headers["authorization"];
	if (typeof bearerHeader !== 'undefined') {
		var bearer = bearerHeader.split(" ");
		bearerToken = bearer[1];
		req.token = bearerToken;
		next();
	} else {
		res.send(403);
	}
}
