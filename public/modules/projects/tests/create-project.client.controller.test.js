'use strict';

(function() {
	// Create project Controller Spec
	describe('Create project Controller Tests', function() {
		// Initialize global variables
		var CreateProjectController,
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

			// Initialize the Create project controller.
			CreateProjectController = $controller('CreateProjectController', {
				$scope: scope
			});
		}));

		it('$scope.createProject() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Projects) {
			// Create a sample Project object
			var sampleProjectPostData = new Projects({
				name: 'New Project',
				description: 'Test',
			});

			// Create a sample Project response
			var sampleProjectResponse = new Projects({
				_id: '525cf20451979dea2c000001',
				name: 'New Project',
				description: 'Test',
			});

			// Fixture mock form input values
			scope.name = 'New Project';
			scope.description = 'Test';

			// $httpBackend.expectGET('/users/getUsers').respond(200);
			$httpBackend.whenGET('/users/getUsers').respond(200);

			// Set POST response
			$httpBackend.expectPOST('projects', sampleProjectPostData).respond(sampleProjectResponse);

			// Run controller functionality
			scope.createProject();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Project was created
			expect($location.path()).toBe('/projects/' + sampleProjectResponse._id);
		}));

		it('Should do some controller test', inject(function() {
			// The test logic
			// ...
		}));
	});
}());