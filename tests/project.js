// Mock objects

var mongoose = Object;
var app = Object;
mongoose.model = function(a, b) {
	return function() {
		this.save = function() {};
		this.find = function() {};
	};
};
app.projectSchema = Object;
var request = Object;
var response = Object;
response.send = function(param) {};

// Module to test
var testProject = process.env.CUSTOM_COV ?
	require('../lib-cov/project/project.js')
	: require('../lib/project/project.js')(app, mongoose);

// For testing purposes
var expected;
var result;

// Tests
exports.testCreateProject = function(test) {
	test.expect(2);
	request.body = {'heading':'testHeading', 'description':'testDesc'};

	testProject.createProject(request, response);

	expected = 'testHeading';
	result = response.body.heading;
	test.equal(expected, result);

	expected = 'testDesc';
	result = response.body.description;
	test.equal(expected, result);

	test.done();
};

exports.testGetAllProjects = function(test) {
	// testProject.getAllProjects(request, response);
	test.done();
};
