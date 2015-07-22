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

		it('Should do some controller test', inject(function() {
			// The test logic
			// ...
		}));

		it('$scope.updateLocalTree() should send cause the estimations of the leaf nodes to bubble-up the tree to the root node', inject(function() {
			// Create new Project object with depth 2
			var sampleProject = {
					children : [
						{
							nodes : [
								{
									nodes : [],
									estimations : [null, 1, null]
								},
								{
									nodes : [],
									estimations : [null, 2, null]
								}
							],
							estimations : [null, null, null]
						}
					],
			};
			scope.project = sampleProject;

			// mock userIndex: middle user
			scope.userIndex = 1;

			scope.updateLocalTree(scope);

			expect(scope.project.children[0].estimations[scope.userIndex]).toBe(3);
		}));

	});
}());