// Config
var main = require('../main.js');
var app = main.app();
var server = main.server();
var mongoose = main.mongoose();
var open = false;
var timeout = setTimeout(function() {
			console.log('exiting');
			process.exit();
		}, 3000);
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
response.res = [];
response.send = function(resp) {
	response.res.push(resp);
};

module.exports = {
	setUp: function(callback) {
		clearTimeout(timeout);
		if (open === true) {
			callback();
			return;
		}
		try {
			mongoose.connection.on('open', function() {
				open = true;
				callback();
			});
		} catch (err) {
			console.log(err);
		}
	},

	tearDown : function(callback) {
		timeout = setTimeout(function() {
			console.log('exiting');
			process.exit();
		}, 3000);
		callback();
	},

	testCreateProject: function(test) {
		// test.expect(11);

		// Object to create
		request.body = {'heading':'testHeading', 'description':'testDesc', 'owner': 'testOwner', 'users': ['testUser1', 'testUser2', 'testUser3']};

		// Function being tested
		testProject.createProject(app, mongoose, request, response);
		var pResult = response.res.pop();
		expected = 'testHeading';
		result = pResult.name;
		test.equal(expected, result);

		expected = 'testDesc';
		result = pResult.description;
		test.equal(expected, result);

		expected = false;
		result = pResult.deleted;
		test.equal(expected, result);

		expected = 0;
		result = pResult.children.length;
		test.equal(expected, result);

		expected = 'testOwner';
		result = pResult.owner;
		test.equal(expected, result);

		expected = 3;
		result = pResult.users.length;
		test.equal(expected, result);

		expected = 'testUser1';
		result = pResult.users[0];
		test.equal(expected, result);

		expected = 'testUser3';
		result = pResult.users[2];
		test.equal(expected, result);

		request.body = {'heading':'testHeading', 'description':'testDesc', 'owner': '', 'users': ['testUser1', 'testUser2', 'testUser3']};
		testProject.createProject(app, mongoose, request, response);

		pResult = response.res.pop();
		expected = false;
		result = pResult;
		test.equal(expected, result);

		request.body = {'heading':'testHeading2', 'description':'testDesc2', 'owner': 'testOwner', 'users': ['testUser1', 'testUser3']};
		testProject.createProject(app, mongoose, request, response);

		pResult = response.res.pop();
		expected = 'testHeading2';
		result = pResult.name;
		test.equal(expected, result);

		expected = 'testDesc2';
		result = pResult.description;
		test.equal(expected, result);

		request.body = {'heading':'testHeading3', 'description':'testDesc4', 'owner': 'testOwner', 'users': ['testUser1', 'testUser3']};
		testProject.createProject(app, mongoose, request, response);
		response.res.pop();
		request.body = {'heading':'testHeading4', 'description':'testDesc5', 'owner': 'testOwner', 'users': ['testUser1', 'testUser3']};
		testProject.createProject(app, mongoose, request, response);
		response.res.pop();

		test.done();
	},

	testGetAllProjects: function(test) {
		testProject.getAllProjects(app, mongoose, request, response, function(res) {
			var tmp = response.res.pop();
			expected = 4;
			result = tmp.length;
			test.equal(expected, result);

			expected = 'testHeading';
			result = tmp[0].name;
			test.equal(expected, result);

			expected = 'testHeading2';
			result = tmp[1].name;
			test.equal(expected, result);

			expected = 'testHeading3';
			result = tmp[2].name;
			test.equal(expected, result);

			expected = 'testHeading4';
			result = tmp[3].name;
			test.equal(expected, result);
			test.done();
		});
	},

	testGetProject: function(test) {
		request.body = {'heading': 'testHeading'};
		testProject.getProject(app, mongoose, request, response, function(res) {
			result = response.res.pop()[0];

			expected = 'testHeading';
			test.equal(expected, result.name);

			expected = 'testDesc';
			test.equal(expected, result.description);

			expected = 'testOwner';
			test.equal(expected, result.owner);
			expected = 3;
			test.equal(expected, result.users.length);

			expected = 'testUser1';
			test.equal(expected, result.users[0]);
			request.body = {'heading':'testConflictHeading', 'description':'testConflictDesc', 'owner': 'testConflictOwner', 'users': ['testUser3']};
			testProject.createProject(app, mongoose, request, response, function() {
				request.body = {'heading':'testHeading'};
				testProject.getProject(app, mongoose, request, response, function(res) {
					expected = 2;
					test.equal(expected, response.res.length);
					test.done();
				});
			});
		});
	}

};
