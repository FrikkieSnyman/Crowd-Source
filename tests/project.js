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
response.res = '';
response.send = function(res) {response.res = res;};

// Tests
exports.testCreateProject = function(test) {
	test.expect(9);

	// Object to create
	request.body = {'heading':'testHeading', 'description':'testDesc', 'owner': 'testOwner', 'users': ['testUser1', 'testUser2', 'testUser3']};

	// Function being tested
	testProject.createProject(app, mongoose, request, response);

	expected = 'testHeading';
	result = response.res.name;
	test.equal(expected, result);

	expected = 'testDesc';
	result = response.res.description;
	test.equal(expected, result);

	expected = false;
	result = response.res.deleted;
	test.equal(expected, result);

	expected = 0;
	result = response.res.children.length;
	test.equal(expected, result);

	expected = 'testOwner';
	result = response.res.owner;
	test.equal(expected, result);

	expected = 3;
	result = response.res.users.length;
	test.equal(expected, result);

	expected = 'testUser1';
	result = response.res.users[0];
	test.equal(expected, result);

	expected = 'testUser3';
	result = response.res.users[2];
	test.equal(expected, result);

	request.body = {'heading':'testHeading', 'description':'testDesc', 'owner': '', 'users': ['testUser1', 'testUser2', 'testUser3']};
	testProject.createProject(app, mongoose, request, response);

	expected = false;
	result = response.res;
	test.equal(expected, result);

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
