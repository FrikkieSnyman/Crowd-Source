'use strict';

(function() {
	// Projects Controller Spec
	describe('Projects Controller Tests', function() {
		// Initialize global variables
		var ProjectsController,
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

			// Initialize the Projects controller.
			ProjectsController = $controller('ProjectsController', {
				$scope: scope
			});
		}));
		
		it('$scope.find() should create an array with at least one Project object fetched from XHR', inject(function(Projects) {
			// Create sample Project using the Projects service
			var sampleProject = new Projects({
				name: 'New Project'
			});

			// Create a sample Projects array that includes the new Project
			var sampleProjects = [sampleProject];

			// Set GET response
			$httpBackend.expectGET('projects').respond(sampleProjects);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.projects).toEqualData(sampleProjects);
		}));

		it('$scope.findOne() should create an array with one Project object fetched from XHR using a projectId URL parameter', inject(function(Projects) {
			// Define a sample Project object
			var sampleProject = new Projects({
				name: 'New Project'
			});

			// Set the URL parameter
			$stateParams.projectId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/projects\/([0-9a-fA-F]{24})$/).respond(sampleProject);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.project).toEqualData(sampleProject);
		}));
		
		it('$scope.remove() should send a DELETE request with a valid projectId and remove the Project from the scope', inject(function(Projects) {
			// Create new Project object
			var sampleProject = new Projects({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Projects array and include the Project
			scope.projects = [sampleProject];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/projects\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleProject);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.projects.length).toBe(0);
		}));
	});
}());
