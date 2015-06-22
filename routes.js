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

	 var projects = require('./lib/projects/projects.js')(app, mongoose);
	 app.get('/projects', projects.getProjects);

	/**
	 * UserManagment
	 */
	var usermanagement = require('./lib/usermanagement/usermanagement.js')(app, mongoose);
	console.log(usermanagement.addName);
	app.get('/names', usermanagement.getNames);
	app.post('/name', usermanagement.addName);

	var project = require('./lib/project/project.js')(app, mongoose);
	var response = Object;
	response.send = function() {};
	var request = Object;
	request.body = Object;
	request.body.heading = 'Frikkie';
	request.body.description = 'Pewppewpwpe';
	project.createProject(request, response);
};
