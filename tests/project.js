// Config
var main = require('../main.js');
var app = main.app();
var server = main.server();
var mongoose = main.mongoose();

// Module to test
var testProject = process.env.CUSTOM_COV ?
	require('../lib-cov/project/abstractedProject.js')
	: require('../lib/project/abstractedProject.js');

// For testing purposes
var expected;
var result;

// Mocks
var request = Object;
var response = Object;
response.send = function() {};

// Tests
exports.testCreateProject = function(test) {
	// test.expect(2);
	// request.body = {'heading':'testHeading', 'description':'testDesc'};

	// testProject.createProject(app, mongoose, request, response);

	// expected = 'testHeading';
	// result = response.body.heading;
	// test.equal(expected, result);

	// expected = 'testDesc';
	// result = response.body.description;
	// test.equal(expected, result);

	test.done();
};

exports.testPersistProject = function(test) {
	// test.expect(2);
	// var Project = mongoose.model('Project', app.projectSchema);
	// var project = new Project({
	// 	name : 'test',
	// 	description : 'description',
	// 	children : [{name : 'heading', nodes : []}]
	// });
	// testProject.persistProject(project);

	// expected = 'test';
	// result = project.name;
	// console.log(project);
	// test.equal(expected, result);

	// expected = 'description';
	// result = project.description;
	// test.equal(expected, result);
	test.done();
	setTimeout(function() {
		process.exit();
	}, 3000);
};
