exports.createProject = function(app, mongoose, request, response) {
	var heading = request.body.heading;
	var description = request.body.description;
	var owner = request.body.owner;
	var users = request.body.users;

	if (owner === '') {
		response.send(false);
		return;
	}
	var outerScope = this;
	this.checkProject(heading, app, mongoose, function(result) {
		if (result.length >= 1) {
				//Project name already exists
				for (var i = result.length - 1; i >= 0; i--) {
					if (result[i].deleted === false) {
						response.send(false);
						return;		
					}
				};
		}

		var Project = mongoose.model('Project', app.projectSchema);

		var project = new Project({
			name : heading,
			description : description,
			children : [],
			deleted : false,
			users : users,
			owner : owner
		});
		outerScope.persistProject(project);
		response.send(project);
	});
};

exports.checkProject = function(searchheading, app, mongoose, callback) {
	var res = null;
	var Project = mongoose.model('Project', app.projectSchema);

	Project.find({name: searchheading}, function(err, project) {
		if (err) {
			return console.error(err);
		}
		res = project;
		callback(res);
	});
};
exports.persistProject = function(project) {
	project.save(function(err, data) {
		if (err) {
			console.log(err);
		} else {
			console.log('Saved : ', data);
		}
	});
};

exports.getAllProjects = function(app, mongoose, request, response, callback) {
	var Project = mongoose.model('Project', app.projectSchema);

	Project.find({deleted : 'false'}, function(err, projects) {
		if (err) {
			return console.error(err);
		}
		if (callback === undefined) {
			response.send(projects);
		} else {
			response.send(projects);
			callback(projects);
		}

	});
};

exports.getProject = function(app, mongoose, request, response) {
	var searchheading = request.body.heading;
	var Project = mongoose.model('Project', app.projectSchema);

	Project.find({name: searchheading}, function(err, project) {
		if (err) {
			return console.error(err);
		}
		response.send(project);
	});
};

exports.addChild = function(app, mongoose, request, response) {
	var Project = mongoose.model('Project', app.projectSchema);
	var project = request.body;
	var condition = {_id : project._id};
	var update = project;
	var options = {multi: true};
	Project.update(condition, update, options, function(err, numAffected) {
		console.log(numAffected);
	});
	response.send(project);
};

exports.deleteProject = function(app, mongoose, request, response) {
	var Project = mongoose.model('Project', app.projectSchema);
	var project = request.body;
	var condition = {_id : project._id};
	var update = {deleted : true};
	var options = {multi: true};
	Project.update(condition, update, options, function(err, numAffected) {
		console.log(numAffected);
	});
	response.send(true);
};
