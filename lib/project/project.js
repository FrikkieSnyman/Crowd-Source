var Project = function(_heading, _description) {
	this.heading = _heading;
	this.description = _description;
	this.estimation = null;
	this.owner = null;
	this.children = [];
};

Project.prototype.setOwner = function(_owner) {
	this.owner = _owner;
};

Project.prototype.getOwner = function() {
	return this.owner;
};

Project.prototype.setHeading = function(_heading) {
	this.heading = _heading;
};

Project.prototype.getHeading = function() {
	return this.heading;
};

Project.prototype.setDescription = function(_description) {
	this.description = _description;
};

Project.prototype.getDescription = function() {
	return this.description;
};

Project.prototype.setEstimation = function(estimation) {
	this.estimation = estimation;
};

Project.prototype.getEstimation = function() {
	return this.estimation;
};

Project.prototype.addChild = function(childProject) {
	// TODO
	console.log('TODO project.addChild');
};

Project.prototype.getChildren = function() {
	return children;
};

exports = module.exports = function(app, mongoose) {

	this.createProject = function(request, response) {
		var heading = request.body.heading;
		var description = request.body.description;
		if ((typeof heading) !== 'string') {
			throw 'Illegal heading format';
		}

		if ((typeof description) !== 'string') {
			throw 'Illegal description format';
		}
		var Project = mongoose.model('Project', app.projectSchema);

		var project = new Project({
			name : heading,
			description : description
		});
		console.log(project);
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
		console.log('Client asked me for information');
	};

	// this.getProject = function(callback) {
	// 	callback('This is a stub for retrieving projects');
	// };

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

