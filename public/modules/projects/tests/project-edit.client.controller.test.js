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
			// Create new Project object with depth 1 and 2 children
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
			// test whether other estimations are un-touched
			expect(scope.project.children[0].estimations[0]).toBe(null);
			expect(scope.project.children[0].estimations[2]).toBe(null);


			// Test project with depth 2, but with incomplete tree
			sampleProject = {
					children : [
						{
							nodes : [
								{
									nodes : [
										{
											nodes : [
												{
													nodes : [],
													estimations : [null, null, 2]
												},
												{
													nodes : [
														{
															nodes : [],
															estimations : [null, null, 1]
														}
													],
													estimations : [null, null, null]
												}
											],
											estimations : [null, null, null]
										},
										{
											nodes : [],
											estimations : [null, null, 4]
										}
									],
									estimations : [null, null, null]
								},
								{
									nodes : [],
									estimations : [null, null, 3]
								}
							],
							estimations : [null, null, null]
						}
					],
			};
			scope.project = sampleProject;

			scope.userIndex = 2;
			scope.updateLocalTree(scope);
			expect(scope.project.children[0].estimations[scope.userIndex]).toBe(10);
			// test whether other estimations are un-touched
			expect(scope.project.children[0].estimations[0]).toBe(null);
			expect(scope.project.children[0].estimations[1]).toBe(null);
			// testing internal state of tree
			expect(scope.project.children[0].nodes[0].estimations[2]).toBe(7);
			expect(scope.project.children[0].nodes[0].nodes[0].estimations[2]).toBe(3);
			expect(scope.project.children[0].nodes[0].nodes[1].estimations[2]).toBe(4);
			// testing internal state of tree with regards to other estimators
			expect(scope.project.children[0].nodes[0].estimations[0]).toBe(null);
			expect(scope.project.children[0].nodes[0].nodes[0].estimations[0]).toBe(null);
			expect(scope.project.children[0].nodes[0].nodes[1].estimations[0]).toBe(null);

			// test for updating of values already in the tree
			// initialise new tree values
			scope.project.children[0].nodes[0].estimations[2] = 999;
			scope.project.children[0].nodes[0].nodes[0].estimations[2] = 999;
			
			scope.updateLocalTree(scope);
			expect(scope.project.children[0].estimations[scope.userIndex]).toBe(10);
			// test whether other estimations are un-touched
			expect(scope.project.children[0].estimations[0]).toBe(null);
			expect(scope.project.children[0].estimations[1]).toBe(null);
			// testing internal state of tree
			expect(scope.project.children[0].nodes[0].estimations[2]).toBe(7);
			expect(scope.project.children[0].nodes[0].nodes[0].estimations[2]).toBe(3);
			expect(scope.project.children[0].nodes[0].nodes[1].estimations[2]).toBe(4);
			// testing internal state of tree with regards to other estimators
			expect(scope.project.children[0].nodes[0].estimations[0]).toBe(null);
			expect(scope.project.children[0].nodes[0].nodes[0].estimations[0]).toBe(null);
			expect(scope.project.children[0].nodes[0].nodes[1].estimations[0]).toBe(null);

		}));

	});
}());