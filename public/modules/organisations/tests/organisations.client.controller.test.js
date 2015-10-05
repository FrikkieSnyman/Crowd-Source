'use strict';

(function() {
	// Organisations Controller Spec
	describe('Organisations Controller Tests', function() {
		// Initialize global variables
		var OrganisationsController,
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

			// Initialize the Organisations controller.
			OrganisationsController = $controller('OrganisationsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Organisation object fetched from XHR', inject(function(Organisations) {
			// Create sample Organisation using the Organisations service
			var sampleOrganisation = new Organisations({
				name: 'New Organisation'
			});

			// Create a sample Organisations array that includes the new Organisation
			var sampleOrganisations = [sampleOrganisation];

			// Set GET response
			$httpBackend.expectGET('organisations').respond(sampleOrganisations);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.organisations).toEqualData(sampleOrganisations);
		}));

		it('$scope.findOne() should create an array with one Organisation object fetched from XHR using a organisationId URL parameter', inject(function(Organisations) {
			// Define a sample Organisation object
			var sampleOrganisation = new Organisations({
				name: 'New Organisation'
			});

			// Set the URL parameter
			$stateParams.organisationId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/organisations\/([0-9a-fA-F]{24})$/).respond(sampleOrganisation);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.organisation).toEqualData(sampleOrganisation);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Organisations) {
			// Create a sample Organisation object
			var sampleOrganisationPostData = new Organisations({
				name: 'New Organisation'
			});

			// Create a sample Organisation response
			var sampleOrganisationResponse = new Organisations({
				_id: '525cf20451979dea2c000001',
				name: 'New Organisation'
			});

			// Fixture mock form input values
			scope.name = 'New Organisation';

			// Set POST response
			$httpBackend.expectPOST('organisations', sampleOrganisationPostData).respond(sampleOrganisationResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Organisation was created
			expect($location.path()).toBe('/organisations/' + sampleOrganisationResponse._id);
		}));

		it('$scope.update() should update a valid Organisation', inject(function(Organisations) {
			// Define a sample Organisation put data
			var sampleOrganisationPutData = new Organisations({
				_id: '525cf20451979dea2c000001',
				name: 'New Organisation'
			});

			// Mock Organisation in scope
			scope.organisation = sampleOrganisationPutData;

			// Set PUT response
			$httpBackend.expectPUT(/organisations\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/organisations/' + sampleOrganisationPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid organisationId and remove the Organisation from the scope', inject(function(Organisations) {
			// Create new Organisation object
			var sampleOrganisation = new Organisations({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Organisations array and include the Organisation
			scope.organisations = [sampleOrganisation];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/organisations\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleOrganisation);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.organisations.length).toBe(0);
		}));
	});
}());