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

exports.testProjectObjectSetOwner = function(test) {
	var expected;
	var result;
	var project;
	test.expect(3);
	testProject.createProject('testHeading', 'testDesc', function(res) {
		project = res;
	});

	// Test 1: Test if owner constructs to null
	expected = null;
	result = project.getOwner();
	test.equal(expected, result);

	// Test 2: Set inital owner
	project.setOwner('Frikkie');
	expected = 'Frikkie';
	result = project.getOwner();
	test.equal(expected, result);

	// Test 3: reset owner
	project.setOwner('Andre');
	expected = 'Andre';
	result = project.getOwner();
	test.equal(expected, result);

	test.done();
};

exports.testProjectObjectSetHeading = function(test) {
	var expected;
	var result;
	var project;
	test.expect(3);

	testProject.createProject('testHeading', 'testDesc', function(res) {
		project = res;
	});

	// Test 1: Test if initial heading is set correctly
	expected = 'testHeading';
	result = project.getHeading();
	test.equal(expected, result);

	// Test 2: Test if heading updates correctly
	expected = 'Updated Heading';
	project.setHeading('Updated Heading');
	result = project.getHeading();
	test.equal(expected, result);

	// Test 3: Test if second change works
	expected = 'Final heading';
	project.setHeading('Final heading');
	result = project.getHeading();
	test.equal(expected, result);

	test.done();
};

exports.testProjectObjectSetDescription = function(test) {
	var expected;
	var result;
	var project;
	test.expect(3);

	testProject.createProject('testHeading', 'testDesc', function(res) {
		project = res;
	});

	// Test 1: Test if initial description is set correctly
	expected = 'testDesc';
	result = project.getDescription();
	test.equal(expected, result);

	// Test 2: Test if heading updates correctly
	expected = 'This is the first updated description';
	project.setDescription('This is the first updated description');
	result = project.getDescription();
	test.equal(expected, result);

	// Test 3: Test if second change works
	expected = 'Final description';
	project.setDescription('Final description');
	result = project.getDescription();
	test.equal(expected, result);

	test.done();
};

exports.testProjectObjectSetEstimation = function(test) {

	var MockEstimate = function() {
		this.title = 'This is a mock estimation object';
	};

	var expected;
	var result;
	var project;
	test.expect(2);
	testProject.createProject('testHeading', 'testDesc', function(res) {
		project = res;
	});

	// Test 1: Test if initial estimation is set correctly
	expected = null;
	result = project.getEstimation();
	test.equal(expected, result);

	// Test 2: Set estimation
	var tmpEst = new MockEstimate();
	expected = tmpEst;
	project.setEstimation(tmpEst);
	result = project.getEstimation();
	test.equal(expected, result);

	test.done();
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
