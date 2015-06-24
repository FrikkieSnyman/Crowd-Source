var absProject = require('./abstractedProject.js');

module.exports = function(app, mongoose) {

	this.createProject = function(request, response) {
		absProject.createProject(app, mongoose, request, response);
	};

	this.getAllProjects = function(request, response) {
		absProject.getAllProjects(app, mongoose, request, response);
	};

	this.getProject = function(request, response) {
		absProject.getProject(app, mongoose, request, response);
	};

	// this.hideProject = function(callback) {
	// 	callback('This is a stub for hiding a project');
	// };

	// this.updateProject = function(callback) {
	// 	callback('This is a stub for updating a project');
	// };

	this.addChild = function(request, response) {
		absProject.addChild(app, mongoose, request, response);
	};
	return this;
};

