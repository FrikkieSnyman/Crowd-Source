var Project = function(_heading, _description) {
	this.heading = _heading;
	this.description = _description;
	this.estimation = null;
	this.children = null;
	this.owner = null;
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

Project.prototype.setEstimaion = function(estimation) {
	this.estimation = estimation;
};

Project.prototype.getEstimation = function() {
	return this.estimation;
};

Project.prototype.addChild = function(childProject) {

};

Project.prototype.getChildren = function() {
	return children;
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

