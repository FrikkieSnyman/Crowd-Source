var testProject = require('../lib/project/project.js');
console.log("Running tests for demonstration purposes");
exports.testCreateProject = function(test){
	test.expect(1);
	var expected = "This is a stub for creation of a new project";
	var result;
	testProject.createProject(function(res){
		result = res;
		test.equal(expected,result);
		test.done();
	});
}

exports.testGetProject = function(test){
	test.expect(1);
	var expected = "This is a stub for retrieving projects";
	var result;
	testProject.getProject(function(res){
		result = res;
		test.equal(expected,result);
		test.done();
	});
}

exports.testHideProject = function(test){
	test.expect(1);
	var expected = "This is a stub for hiding a project";
	var result;
	testProject.hideProject(function(res){
		result = res;
		test.equal(expected,result);
		test.done();
	});
}

exports.testUpdateProject = function(test){
	test.expect(1);
	var expected = "This is a stub for updating a project";
	var result;
	testProject.updateProject(function(res){
		result = res;
		test.equal(expected,result);
		test.done();
	});
}