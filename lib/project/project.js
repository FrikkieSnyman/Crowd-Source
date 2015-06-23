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
			response.send(projects);
		});
	};

	this.getProject = function(request, response) {
		var searchheading = request.body.heading;
		var Project = mongoose.model('Project', app.projectSchema);

		Project.find({name: searchheading}, function(err, project) {
			if (err) {
				return console.error(err);
			}
			response.send(project);
		});
	};

	// this.hideProject = function(callback) {
	// 	callback('This is a stub for hiding a project');
	// };

	// this.updateProject = function(callback) {
	// 	callback('This is a stub for updating a project');
	// };

	this.addChild = function(request, response) {
		// var projectToAdd = request.body.project;
		// var childHeading = request.body.childHeading;
		// var childDescription = request.body.childDescription;
		// var Project = mongoose.model('Project', app.projectSchema);

		// var childProject = new Project({
		// 	name : childHeading,
		// 	description : childDescription,
		// 	children : []
		// });

		// project.children.push(childProject);
		// this.persistProject(project);
		// response.send(project);
		// var arr = request.body;

		var Project = mongoose.model('Project', app.projectSchema);
		var project = request.body;
		var condition = {_id : project._id};
		var update = project;
		var options = {multi: true};
		Project.update(condition, update, options, function(err, numAffected) {
			console.log(numAffected);
		});

		// console.log(project);
		// this.persistProject(project);
		response.send(project);
	};

	return this;
};

