// var testProject = require('../');

var testProject = process.env.CUSTOM_COV ?
	require('../lib-cov/project/project.js')
	: require('../lib/project/project.js');

exports.testCreateProject = function(test) {
	test.expect(4);
	var expected;
	var result;

	// Test 1: Test if correct exception is thrown when a non-string heading is sent
	expected = 'Illegal heading format';
	try {
		testProject.createProject(null, 'test', function(res) {
			result = res;
		});
	} catch (err) {
		test.equal(err, expected);
	}

	// Test 2: Test if correct exception is thrown when a non-string description is sent
	expected = 'Illegal description format';
	try {
		testProject.createProject('test', null, function(res) {
			result = res;
		});
	} catch (err) {
		test.equal(err, expected);
	}

	// Test 3: Test if a project is created and returned as an object succesfully
	testProject.createProject('testProject', 'This is a test creation of a project', function(res) {
		result = res;
		expected = 'testProject';
		test.equal(expected, result.getHeading());
		expected = 'This is a test creation of a project';
		test.equal(expected, result.getDescription());
		test.done();
	});
};

exports.testGetProject = function(test) {
	test.expect(1);
	var expected = 'This is a stub for retrieving projects';
	var result;
	testProject.getProject(function(res) {
		result = res;
		test.equal(expected, result);
		test.done();
	});
};

exports.testHideProject = function(test) {
	test.expect(1);
	var expected = 'This is a stub for hiding a project';
	var result;
	testProject.hideProject(function(res) {
		result = res;
		test.equal(expected, result);
		test.done();
	});
};

exports.testUpdateProject = function(test) {
	test.expect(1);
	var expected = 'This is a stub for updating a project';
	var result;
	testProject.updateProject(function(res) {
		result = res;
		test.equal(expected, result);
		test.done();
	});
};

exports.testAddChild = function(test) {
	test.expect(1);
	var expected = 'temp';
	var result;
	testProject.addChild(result, function(res) {
		result = res;
		test.equal(expected, result);
		test.done();
	});
};
