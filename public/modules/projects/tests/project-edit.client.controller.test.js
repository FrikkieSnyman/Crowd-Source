'use strict';

(function() {
	// Project edit Controller Spec
	describe('Project edit Controller Tests', function() {
		// Initialize global variables
		var ProjectEditController,
			scope,
			$httpBackend,
			$stateParams,
			$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Project edit controller.
			ProjectEditController = $controller('ProjectEditController', {
				$scope: scope
			});
		}));

		it('$scope.update() should update a valid Project', inject(function(Projects) {
			// Define a sample Project put data
			var sampleProjectPutData = new Projects({
				_id: '525cf20451979dea2c000001',
				name: 'New Project'
			});

			scope.authentication = { user : { username : 'peter bell' } };

			// Mock Project in scope
			scope.project = sampleProjectPutData;

			$httpBackend.whenPOST('/project').respond([{users : ['peter bell', 'Jamie Olive']}]);

			// Set PUT response
			$httpBackend.expectPUT(/projects\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/projects/' + sampleProjectPutData._id);
		}));

		it('Should do some controller test', inject(function() {
			// The test logic
			// ...
		}));
	});
}());