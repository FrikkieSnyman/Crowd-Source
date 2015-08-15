'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'estimate-swarm';
	var applicationModuleVendorDependencies = ['ngResource',
	'ngCookies',
	'ngAnimate',
	'ngTouch',
	'ngSanitize',
	'ui.router',
	'ui.utils',
	'ngMaterial',
	'ui.tree',
	'ngAria',];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
])
.config(function($mdThemingProvider) {
	$mdThemingProvider.theme('default')
	.primaryPalette('indigo')
	.accentPalette('yellow');
}).constant('RESOURCE_DOMAIN', 'http://188.166.89.244');

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('projects');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('reports');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('sidenav');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', '$location', '$mdSidenav', '$mdUtil',
	function($scope, Authentication, Menus, $location, $mdSidenav, $mdUtil) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		$scope.goTo = function(route) {
			$location.path(route);
		};

		$scope.onProjects = function() {
			// console.log($location);
			return $location.path() === '/projects';
		};

		$scope.sidenav = $mdSidenav;
		function buildToggler(navID) {
			var debounceFn =  $mdUtil.debounce(function() {
				$mdSidenav(navID)
				.toggle()
        .then(function() {
        });
			}, 300);
			return debounceFn;
		}
		$scope.toggleLeft = buildToggler('left');

	}
]);

'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);

'use strict';

angular.module('core').controller('MainController', ['$scope',
	function($scope) {
		// Main controller controller logic
		// ...
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

//Setting up route
angular.module('projects').config(['$stateProvider',
	function($stateProvider) {
		// Projects state routing
		$stateProvider.
		state('listProjects', {
			url: '/projects',
			templateUrl: 'modules/projects/views/list-projects.client.view.html'
		}).
		state('createProject', {
			url: '/projects/create',
			templateUrl: 'modules/projects/views/create-project.client.view.html'
		}).
		state('viewProject', {
			url: '/projects/:projectId',
			templateUrl: 'modules/projects/views/view-project.client.view.html'
		}).
		state('editProject', {
			url: '/projects/:projectId/edit',
			templateUrl: 'modules/projects/views/edit-project.client.view.html'
		});
	}
]);
'use strict';

angular.module('projects').controller('CreateProjectController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projects', '$http', '$mdToast', '$mdDialog', '$timeout', '$rootScope', 'RESOURCE_DOMAIN',
	function($scope, $stateParams, $location, Authentication, Projects, $http, $mdToast, $mdDialog, $timeout, $rootScope, RESOURCE_DOMAIN) {
		$scope.authentication = Authentication;
		$scope.people = [];

		$http.get(RESOURCE_DOMAIN+'/users/getUsers').success(function(users) {
			for (var i in users) {
				$scope.people.push(users[i].username);
			}
		});

		$scope.selected = [];
		$scope.toggle = function(item, list) {
			var idx = list.indexOf(item);
			if (idx > -1) {
				list.splice(idx, 1);
			} else {
				list.push(item);
			}
		};

		$scope.exists = function(item, list) {
			return list.indexOf(item) > -1;
		};

		$scope.createProject = function() {
			//		var project = {'name': $scope.projectName, 'description': $scope.description, 'owner' : Authentication.user, 'users' : $scope.selected};
			var project = new Projects ({
				name: $scope.projectName,
				description: $scope.description,
				users : $scope.selected,
				owner : $scope.authentication.user.username,
				openForEstimation : false
			});
			project.$save(function(response) {
				$location.path('projects/' + project._id + '/edit');
				$mdToast.show(
					$mdToast.simple()
						.content('Project created')
						.position($scope.getToastPosition())
						.hideDelay(3000)
				);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		
		$scope.toastPosition = {
			bottom: true,
			top: false,
			left: false,
			right: true
		};

		$scope.getToastPosition = function() {
			return Object.keys($scope.toastPosition)
			.filter(function(pos) { return $scope.toastPosition[pos]; })
			.join(' ');
		};		
	}
]);
'use strict';

angular.module('projects').controller('ProjectEditController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projects', '$http', '$mdToast', '$mdDialog', '$timeout', '$rootScope', 'RESOURCE_DOMAIN',
	function($scope, $stateParams, $location, Authentication, Projects, $http, $mdToast, $mdDialog, $timeout, $rootScope, RESOURCE_DOMAIN) {
		$scope.members = true;
		$scope.estimated = false;
		$scope.goTo = function(route) {
			$location.path(route);
		};

		$scope.authentication = Authentication;
		$scope.userIndex = -1;
		var project = {'projectId': $stateParams.projectId};
		$http({method:'POST', url:RESOURCE_DOMAIN + '/project', data: project}).success(function(data) {
			if (data.length !== 0) {
				var tmp = data[0];
				for (var u in tmp.users) {
					if (tmp.users[u] === $scope.authentication.user.username) {
						$scope.userIndex = u;
					}
				}

				if ($scope.userIndex === -1) {
					var toast = $mdToast.simple()
					.content('Not authorised to estimate')
					.action('')
					.highlightAction(false)
					.position($scope.getToastPosition());
					$mdToast.show(toast);
				}
			}
		});

		$scope.rootIsEmpty = function() {
			if ($scope.project.$resolved !== false) {
				if ($scope.project.children.length < 1) {
					return true;
				} else {
					return false;
				}
			}
		};

		$scope.owner = function() {
			if ($scope.project.$resolved !== false) {
				if ($scope.project.owner === $scope.authentication.user.username) {
					return true;
				} else {
					return false;
				}
			}
		};

		$scope.estimator = function() {
			if ($scope.userIndex === -1) {
				return false;
			} else {
				return true;
			}
		};

		$scope.submitEstimation = function() {
			$scope.saveProject();
			$scope.estimated = true;
			$scope.determineEstimations();
		};

		$scope.determineEstimations = function() {
			for (var i = 0; i < $scope.project.users.length; ++i) {
				if ($scope.project.children[0].estimations[i] === null) {
					// An estimator still hasn't estimated
					return;
				}
			}
			$scope.sendEstimationReport();
		};

		$scope.sendEstimationReport = function() {
			$http({method:'POST', url:RESOURCE_DOMAIN + '/reports', data: $scope.project}).success(function(data) {

			});
		};

		$scope.openForEstimation = function() {
			var confirm = $mdDialog.confirm()
			.parent(angular.element(document.body))
			.title('Are you sure you want to open the project for estimations?')
			.content('This will allow estimators to estimate, but will lock the project tree to its current state.')
			.ariaLabel('Open for estimation')
			.ok('Yes')
			.cancel('No');
			$mdDialog.show(confirm).then(function() {
				$timeout(function() {
					$scope.project.openForEstimation = true;
					$scope.saveProject();

					var project = {'projectId': $scope.project._id};

					$http({method:'POST', url:RESOURCE_DOMAIN + '/sendInvites', data: project}).success(function(data) {
						
					});
				});
			}, function() {
			});
		};

		$scope.isOpenForEstimation = function() {
			if ($scope.project.$resolved !== false) {
				return $scope.project.openForEstimation;
			} else {
				return false;
			}
		};

		$scope.addRootNode = function() {
			// initialise estimations array
			var estimationsArr = [];
			for (var i in $scope.project.users) {
				estimationsArr.push(null);
			}
			$scope.project.children.push({id: 'node', title:'Root Node', nodes: [], collapsed : false, estimations : estimationsArr});
		};

		$scope.update = function() {
			var project = $scope.project;

			project.$update(function() {
				$location.path('projects/' + project._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.projects = Projects.query();
		};

		// Find existing Project
		$scope.findOne = function() {
			$scope.project = Projects.get({
				projectId: $stateParams.projectId
			}, function() {
				if ($scope.project.children[0].estimations[$scope.userIndex] === null) {
					$scope.estimated = false;
				} else {
					$scope.estimated = true;
				}
			});
		};

		$scope.newSubItem = function(scope) {
			// console.log(scope.project.users);
			var nodeData = scope.$modelValue;
			// console.log(nodeData);
			var estimationsArr = [];
			for (var i in scope.project.users) {
				// console.log(i);
				estimationsArr.push(null);
			}
			nodeData.nodes.push({
				id: nodeData.id * 10 + nodeData.nodes.length,
				title: nodeData.title + '.' + (nodeData.nodes.length + 1),
				nodes: [],
				collapsed : false,
				estimations : estimationsArr
			});
		};

		$scope.undoToolTip = function(node, removeNode, newSubItem) {
			//debugger;
			var tree = $.extend(true, [], $scope.project.children);

			removeNode(node);

			var toast = $mdToast.simple()
				.content('Node deleted')
				.action('UNDO')
				.highlightAction(false)
				.position($scope.getToastPosition());
			$mdToast.show(toast).then(function() {
				$scope.project.children = $.extend(true, [], tree);
			});
		};

		$scope.toastPosition = {
			bottom: true,
			top: false,
			left: false,
			right: true
		};

		$scope.getToastPosition = function() {
			return Object.keys($scope.toastPosition)
			.filter(function(pos) { return $scope.toastPosition[pos]; })
			.join(' ');
		};

		$scope.saveProject = function() {
			$scope.project.$update(function(response) {
				$mdToast.show(
					$mdToast.simple()
					.content('Project saved')
					.position($scope.getToastPosition())
					.hideDelay(3000)
				);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.querySearch = function(query) {
			//console.log(query);
			var results = query ? $scope.projects.filter(createFilterFor(query)) : $scope.projects, deferred;
			return results;
		};

		$scope.searchTextChange = function(text) {
			console.log('Text changed to ' + text);
		};

		$scope.selectedItemChange = function(item) {
			console.log(item);
			$scope.goTo('/projects/' + item._id + '/edit');
		};

		var createFilterFor = function(query) {
			var lowercaseQuery = angular.lowercase(query);
			return function filterFn(item) {
				//console.log(item);
				var name = angular.lowercase(item.name);
				return (name.indexOf(lowercaseQuery) === 0);
			};
		};

		$scope.collapseAll = function() {
			$scope.$broadcast('collapseAll');
		};

		$scope.expandAll = function() {
			$scope.$broadcast('expandAll');
		};

		function DialogController($scope, $mdDialog) {
			$scope.hide = function() {
				$mdDialog.hide();
			};
			$scope.cancel = function() {
				$mdDialog.cancel();
			};
		}

		$scope.showDescriptionDialog = function(ev, node) {
			$scope.currentNode = node;

			$scope.setCurrentNode(node, function() {
				var newScope = $scope.$new();

				$mdDialog.show({
					controller: DialogController,
					templateUrl: 'modules/projects/views/description.dialog.client.view.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					scope: newScope
				});
			});
		};

		$scope.updateLocalTree = function(scope) {
			var count = $scope.userIndex;
			var currnode = $scope.project.children[0];
			var result;

			$scope.getEstimation(currnode, count, function(res) {
				result = res;
			});
		};

		$scope.getEstimation = function(node, userNum, callback) {
			if (node.nodes.length <= 0) {
				callback(node.estimations[userNum]);
			} else {
				node.estimations[userNum] = null;
				for (var i in node.nodes) {
					$scope.getEstimation(node.nodes[i], userNum, function(result) {
						if (node.estimations[userNum] === null) {
							node.estimations[userNum] = parseInt(result);
						} else {
							node.estimations[userNum] += parseInt(result);
						}
						callback(parseInt(result));
					});
				}
			}
		};

		$scope.currentNode = undefined;

		$scope.setCurrentNode = function(node, callback) {
			$scope.currentNode = node;

			if (callback !== undefined) {
				callback();
			}
		};

		$scope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
			if (!$scope.confirm) {
				event.preventDefault();
				//console.log(newUrl);
				var confirm = $mdDialog.confirm()
				.parent(angular.element(document.body))
				.title('Are you sure you want to leave this page?')
				.content('All unsaved changes will be lost.')
				.ariaLabel('Yes')
				.ok('Yes')
				.cancel('No')
				.targetEvent(event);
				$mdDialog.show(confirm).then(function() {
					newUrl = newUrl.split('#!');
					$scope.goTo(newUrl[1]);
					$scope.confirm = true;
					//$scope.saveProject();
				}, function() {});
			}
		});
	}
]);

'use strict';

// Projects controller
angular.module('projects').controller('ProjectsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projects', '$http', '$mdToast', '$mdDialog', '$timeout', '$rootScope', 'RESOURCE_DOMAIN',
	function($scope, $stateParams, $location, Authentication, Projects, $http, $mdToast, $mdDialog, $timeout, $rootScope, RESOURCE_DOMAIN) {

		$scope.goTo = function(route) {
			$location.path(route);
		};
		$scope.owner = function(project) {
			if (Authentication.user.username === project.owner) {
				return true;
			} else {
				return false;
			}
		};
		$scope.createProject = function() {
			//		var project = {'name': $scope.projectName, 'description': $scope.description, 'owner' : Authentication.user, 'users' : $scope.selected};
			var project = new Projects ({
			name: $scope.projectName,
			description: $scope.description,
			users : $scope.selected
		});
			project.$save(function(response) {
				$location.path('projects/' + project._id + '/edit');
				$mdToast.show(
				$mdToast.simple()
				.content('Project created')
				.position($scope.getToastPosition())
				.hideDelay(3000)
				);
			}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
		});
			/*
				$http({method:'POST', url:'/projects', data: project}).success(function(res) {
					if (res === false) {
						if (project.owner === '') {
							$mdToast.show(
							$mdToast.simple()
							.content('Need to be logged in to create a project')
							.position($scope.getToastPosition())
							.hideDelay(3000)
							);
						} else {
							$mdToast.show(
							$mdToast.simple()
							.content('There already exists a project with that name')
							.position($scope.getToastPosition())
							.hideDelay(3000)
							);
						}
					} else {
						var invites = {'projectName': $scope.projectName, 'users': $scope.selected};
						//$http({method:'POST', url:'/email', data: invites});

						$mdToast.show(
						$mdToast.simple()
						.content('Project created')
						.position($scope.getToastPosition())
						.hideDelay(3000)
						);

						$scope.goTo('/project/' + project._id);
					}
				});
*/
		};

		$scope.deleteProject = function(project) {
			var confirm = $mdDialog.confirm()
			.parent(angular.element(document.body))
			.title('Are you sure you wish to delete project ' + project.name + '?')
			.content('This will delete the project and prevent it from showing up in the list of projects.')
			.ariaLabel('Delete the project')
			.ok('Yes')
			.cancel('No');
			$mdDialog.show(confirm).then(function() {
				$timeout(function() {
					//$http({method:'DELETE', url:'/projects/' + project._id, data: project}).success(function() {
					//	$scope.updateProjects();
					//});
					$scope.remove(project);
				});
					//debugger;
			}, function() {
			});
		};

		$scope.toastPosition = {
			bottom: true,
			top: false,
			left: false,
			right: true
		};

		$scope.getToastPosition = function() {
			return Object.keys($scope.toastPosition)
			.filter(function(pos) { return $scope.toastPosition[pos]; })
			.join(' ');
		};

		// Remove existing Project
		$scope.remove = function(project) {
			if (project) { 
				project.$remove();

				for (var i in $scope.projects) {
					if ($scope.projects [i] === project) {
						$scope.projects.splice(i, 1);
					}
				}
			} else {
				$scope.project.$remove(function() {
					$location.path('projects');
				});
			}
		};

		// Update existing Project
		$scope.update = function() {
			var project = $scope.project;

			project.$update(function() {
				$location.path('projects/' + project._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Projects
		$scope.find = function() {
			$scope.projects = Projects.query();
		};

		// Find existing Project
		$scope.findOne = function() {
			$scope.project = Projects.get({ 
				projectId: $stateParams.projectId
			});
		};

		$scope.updateProjects = function() {
			$scope.projects = Projects.query();
		};

		$scope.querySearch = function(query) {
			//console.log(query);
			var results = query ? $scope.projects.filter(createFilterFor(query)) : $scope.projects, deferred;
			return results;
		};

		$scope.searchTextChange = function(text) {
			console.log('Text changed to ' + text);
		};

		$scope.selectedItemChange = function(item) {
			console.log(item);
			$scope.goTo('/projects/' + item._id + '/edit');
		};

		var createFilterFor = function(query) {
			var lowercaseQuery = angular.lowercase(query);
			return function filterFn(item) {
				//console.log(item);
				var name = angular.lowercase(item.name);
				return (name.indexOf(lowercaseQuery) === 0);
			};
		};

		$scope.collapseAll = function() {
			$scope.$broadcast('collapseAll');
		};

		$scope.expandAll = function() {
			$scope.$broadcast('expandAll');
		};

		function DialogController($scope, $mdDialog) {
			$scope.hide = function() {
				$mdDialog.hide();
			};
			$scope.cancel = function() {
				$mdDialog.cancel();
			};
		}

		$scope.showDescriptionDialog = function(ev, node) {
			$scope.currentNode = node;

			$scope.setCurrentNode(node, function() {
				var newScope = $scope.$new();

				$mdDialog.show({
					controller: DialogController,
					templateUrl: 'modules/projects/views/description.dialog.client.view.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					scope: newScope
				});
			});
		};
	}
]);

'use strict';

//Projects service used to communicate Projects REST endpoints
angular.module('projects').factory('Projects', ['$resource', 'RESOURCE_DOMAIN',
	function($resource, RESOURCE_DOMAIN) {
		return $resource(RESOURCE_DOMAIN + '/projects/:projectId', {projectId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Setting up route
angular.module('reports').config(['$stateProvider',
	function($stateProvider) {
		// Reports state routing
		$stateProvider.
		state('listReports', {
			url: '/reports',
			templateUrl: 'modules/reports/views/list-reports.client.view.html'
		}).
		state('createReport', {
			url: '/reports/create',
			templateUrl: 'modules/reports/views/create-report.client.view.html'
		}).
		state('viewReport', {
			url: '/reports/:reportId',
			templateUrl: 'modules/reports/views/view-report.client.view.html'
		}).
		state('editReport', {
			url: '/reports/:reportId/edit',
			templateUrl: 'modules/reports/views/edit-report.client.view.html'
		});
	}
]);
'use strict';

// Reports controller
angular.module('reports').controller('ReportsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Reports',
	function($scope, $stateParams, $location, Authentication, Reports) {
		$scope.authentication = Authentication;

		// Create new Report
		$scope.create = function() {
			// Create new Report object
			var report = new Reports ({
				name: this.name
			});

			// Redirect after save
			report.$save(function(response) {
				$location.path('reports/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Report
		$scope.remove = function(report) {
			if ( report ) { 
				report.$remove();

				for (var i in $scope.reports) {
					if ($scope.reports [i] === report) {
						$scope.reports.splice(i, 1);
					}
				}
			} else {
				$scope.report.$remove(function() {
					$location.path('reports');
				});
			}
		};

		// Update existing Report
		$scope.update = function() {
			var report = $scope.report;

			report.$update(function() {
				$location.path('reports/' + report._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Reports
		$scope.find = function() {
			$scope.reports = Reports.query();
		};

		// Find existing Report
		$scope.findOne = function() {
			$scope.report = Reports.get({ 
				reportId: $stateParams.reportId
			});
		};
	}
]);
'use strict';

//Reports service used to communicate Reports REST endpoints
angular.module('reports').factory('Reports', ['$resource', 'RESOURCE_DOMAIN',
	function($resource, RESOURCE_DOMAIN) {
		return $resource(RESOURCE_DOMAIN + 'reports/:reportId', {reportId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

// Sidenav module config
angular.module('sidenav').run(['Menus',
	function(Menus) {
		// Config logic
		// ...
	}
]);
'use strict';

//Setting up route
angular.module('sidenav').config(['$stateProvider',
	function($stateProvider) {
		// Sidenav state routing
		$stateProvider.
		state('dialog', {
			url: '/dialog',
			templateUrl: 'modules/sidenav/views/dialog.client.view.html'
		});
	}
]);
'use strict';

angular.module('sidenav').controller('SidenavController', ['$scope', '$http', '$mdDialog', '$location', 'Authentication' , 'Logindialog', '$mdUtil', '$mdSidenav', '$log', 'RESOURCE_DOMAIN',
	function($scope, $http, $mdDialog, $location, Authentication, Logindialog, $mdUtil, $mdSidenav, $log, RESOURCE_DOMAIN) {
		// Sidenav controller logic
		$scope.authentication = Authentication;

		$scope.signin = Logindialog.signin;
		$scope.signup = Logindialog.signup;
		$scope.forgotPass = Logindialog.forgotPass;

		function DialogController($scope, $mdDialog) {
			$scope.hide = function() {
				$mdDialog.hide();
			};
			$scope.cancel = function() {
				$mdDialog.cancel();
			};
		}

		var showAdvanced = function(ev) {
			$mdDialog.show({
				controller: DialogController,
				templateUrl: 'modules/sidenav/views/dialog.client.view.html',
				parent: angular.element(document.body),
				targetEvent: ev
			});
		};

		$scope.signinDialog = function(ev) {
			Logindialog.signin = true;
			Logindialog.signup = false;
			Logindialog.forgotPass = false;

			showAdvanced(ev);
		};

		$scope.signupDialog = function(ev) {
			Logindialog.signin = false;
			Logindialog.signup = true;
			Logindialog.forgotPass = false;

			showAdvanced(ev);
		};

		function buildToggler(navID) {
			var debounceFn =  $mdUtil.debounce(function() {
				$mdSidenav(navID)
				.toggle()
				.then(function() {
					$log.debug('toggle ' + navID + ' is done');
				});
			}, 300);
			return debounceFn;
		}

		$scope.toggleLeft = buildToggler('left');
		/**
 		* Build handler to open/close a SideNav; when animation finishes
 		* report completion in console
 		*/

		$scope.go = function(path) {
			$location.path(path);
		};

		$scope.signOut = function() {
			$http.get(RESOURCE_DOMAIN + '/auth/signout').success(function(response) {
				$location.path(response);
			});

			$http.get(RESOURCE_DOMAIN + '/auth/signout').success(function(response) {
				// If successful we assign null to the global user model
				$scope.authentication.user = null;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				// $scope.error = response.message;
			});
		};
	}
])
.controller('LeftCtrl', function($scope, $timeout, $mdSidenav, $log) {
	$scope.close = function() {
		$mdSidenav('left').close()
		.then(function() {
			$log.debug('close LEFT is done');
		});
	};
});

'use strict';

angular.module('sidenav').factory('Logindialog', [
	function() {
		// Logindialog service logic
		// ...
		var properties = {
			signin: true,
			signup: false,
			forgotPass: false
		};

		// Public API
		return properties;
	}
]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', '$mdDialog', 'Authentication','RESOURCE_DOMAIN',
	function($scope, $http, $location, $mdDialog, Authentication, RESOURCE_DOMAIN) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post(RESOURCE_DOMAIN + '/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// Close dialog
				$mdDialog.cancel();

				// And redirect to the index page
				$location.path('/projects');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post(RESOURCE_DOMAIN + '/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// Close dialog
				$mdDialog.cancel();

				// And redirect to the index page
				$location.path('/projects');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication','RESOURCE_DOMAIN',
	function($scope, $stateParams, $http, $location, Authentication,RESOURCE_DOMAIN) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post(RESOURCE_DOMAIN + '/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post(RESOURCE_DOMAIN + '/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication', 'RESOURCE_DOMAIN',
	function($scope, $http, $location, Users, Authentication, RESOURCE_DOMAIN) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete(RESOURCE_DOMAIN + '/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post(RESOURCE_DOMAIN + '/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource', 'RESOURCE_DOMAIN',
	function($resource, RESOURCE_DOMAIN) {
		return $resource(RESOURCE_DOMAIN + '/users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
