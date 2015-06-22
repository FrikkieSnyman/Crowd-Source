exports = module.exports = function(app, mongoose) {

	this.createProject = function(request, response) {
		var heading = request.body.heading;
		var description = request.body.description;
		// if ((typeof heading) !== 'string') {
		// 	throw 'Illegal heading format';
		// }

		// if ((typeof description) !== 'string') {
		// 	throw 'Illegal description format';
		// }
		var Project = mongoose.model('Project', app.projectSchema);

		var project = new Project({
			name : heading,
			description : description
		});
		this.persistProject(project);
		response.send(project);
	};

	this.persistProject = function(project) {
		project.save(function(err, data) {
			if (err) {
				console.log(err);
			} else {
				console.log('Saved : ', data);
			}
		});
	};

	this.getAllProjects = function(request, response) {
		var Project = mongoose.model('Project', app.projectSchema);

		Project.find(function(err, projects) {
			if (err) {
				return console.error(err);
			}
			console.log(projects);
			response.send(projects);
		});
	};

	this.getProject = function(request, response) {
		console.log(request.body.heading);
		var searchheading = request.body.heading;
		var resproject;
		var Project = mongoose.model('Project', app.projectSchema);

		Project.find({name: searchheading}, function(err, project) {
			resproject = project;
			console.log(project);
			response.send(project);
		});
	};

	// this.hideProject = function(callback) {
	// 	callback('This is a stub for hiding a project');
	// };

	// this.updateProject = function(callback) {
	// 	callback('This is a stub for updating a project');
	// };

	// this.addChild = function(project, callback) {
	// 	callback('temp');
	// };
	return this;
};

