var Project = function(_heading, _description) {
	this.heading = _heading;
	this.description = _description;
	this.estimation = null;
	this.children = null;
};

Project.prototype.addTask = function(childProject) {
};

exports.createProject = function(heading, description, callback) {
	if ((typeof heading) !== 'string') {
		throw 'Illegal heading format';
	}

	if ((typeof description) !== 'string') {
		throw 'Illegal description format';
	}

	var project = new Project(heading, description);
	callback(project);
};

exports.getProject = function(callback) {
	callback('This is a stub for retrieving projects');
};

exports.hideProject = function(callback) {
	callback('This is a stub for hiding a project');
};

exports.updateProject = function(callback) {
	callback('This is a stub for updating a project');
};

exports.addChild = function(project, callback) {
	callback('temp');
};

