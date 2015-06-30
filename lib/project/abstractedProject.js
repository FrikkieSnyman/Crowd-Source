exports.createProject = function(app, mongoose, request, response) {
	var heading = request.body.heading;
	var description = request.body.description;
	var owner = request.body.owner;
	var Project = mongoose.model('Project', app.projectSchema);

	var project = new Project({
		name : heading,
		description : description,
		children : [],
		deleted : false,
		users : [],
		owner : owner
	});
	this.persistProject(project);
	response.send(project);
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

exports.getAllProjects = function(app, mongoose, request, response) {
	var Project = mongoose.model('Project', app.projectSchema);

	Project.find({deleted : 'false'}, function(err, projects) {
		if (err) {
			return console.error(err);
		}
		response.send(projects);
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
