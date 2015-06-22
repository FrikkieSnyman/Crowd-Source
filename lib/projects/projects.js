exports = module.exports = function(app, mongoose) {
	this.getProjects = function(request, response) {

		var projects = [];

		var projectA = {"name":"AI Thing"};
		var projectB = {"name":"BI Thing"};

		projects.push(projectA);
		projects.push(projectB);
		response.projects = projects;
		response.send(console.log('inside send'));
	};

	return this;
};