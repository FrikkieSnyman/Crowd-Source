'use strict';

// Organisations controller
angular.module('organisations').controller('OrganisationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Organisations',
	function($scope, $stateParams, $location, Authentication, Organisations) {
		$scope.authentication = Authentication;

		// Create new Organisation
		$scope.create = function() {
			// Create new Organisation object
			var organisation = new Organisations ({
				name: this.name
			});

			// Redirect after save
			organisation.$save(function(response) {
				$location.path('organisations/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Organisation
		$scope.remove = function(organisation) {
			if ( organisation ) { 
				organisation.$remove();

				for (var i in $scope.organisations) {
					if ($scope.organisations [i] === organisation) {
						$scope.organisations.splice(i, 1);
					}
				}
			} else {
				$scope.organisation.$remove(function() {
					$location.path('organisations');
				});
			}
		};

		// Update existing Organisation
		$scope.update = function() {
			var organisation = $scope.organisation;

			organisation.$update(function() {
				$location.path('organisations/' + organisation._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Organisations
		$scope.find = function() {
			$scope.organisations = Organisations.query();
		};

		// Find existing Organisation
		$scope.findOne = function() {
			$scope.organisation = Organisations.get({ 
				organisationId: $stateParams.organisationId
			});
		};
	}
]);