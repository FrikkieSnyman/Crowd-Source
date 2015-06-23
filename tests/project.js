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
	require('../lib-cov/project/abstractedProject.js')
	: require('../lib/project/abstractedProject.js');

// For testing purposes
var expected;
var result;

// Tests
exports.testCreateProject = function(test) {
	test.expect(2);
	request.body = {'heading':'testHeading', 'description':'testDesc'};

	testProject.createProject(app, mongoose, request, response);

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
