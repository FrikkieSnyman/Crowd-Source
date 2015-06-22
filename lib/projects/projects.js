exports = module.exports = function(app, mongoose) {
	this.getProjects = function(request, response) {
		console.log("Request for projects");
		creatDummy(function(data){
			response.send(data);
		});
	};
	var creatDummy = function(callback){
		var projects = [];

		var projectA = {"name":"AI Thing"};
		var projectB = {"name":"BI Thing"};

		projects.push(projectA);
		projects.push(projectB);
		//response.projects = projects;
		callback(projects);
	};
	return this;
};