'use strict';

angular.module('projects').controller('ChatController', ['$scope','$rootScope','Socket','Authentication','Projects','Headerpath','$stateParams',
	function($scope, $rootScope, Socket, Authentication, Projects, Headerpath, $stateParams) {
		$scope.authentication = Authentication;
		$scope.chat = '';

		Socket.on('project.updated', function(project) {
			if (project._id === $scope.project._id) {
				$scope.project.__v = project.__v;
				$scope.updateChildren(project.children[0], $scope.project.children[0]);
	    	}
		});

		$scope.visit = function(node, scopeNode) {
			scopeNode.chat = node.chat;
			if (node.id === $scope.currentNode) {
				$scope.currentNode = node;
			}
		};

		$scope.updateChildren = function(node, scopeNode) {
			if (node === null) {
				return;
			}
			$scope.visit(node, scopeNode);
			for (var i = 0; i < node.nodes.length; ++i) {
				$scope.updateChildren(node.nodes[i], scopeNode.nodes[i]);
			}
		};

		$scope.visitToFindCurrentNode = function(node) {
			if (node.id === $rootScope.currentNode.id) {
				$scope.currentNode = node;
			}
		};

		$scope.findCurrentNode = function(node) {
			if (node === null) {
				return;
			}
			$scope.visitToFindCurrentNode(node);
			for (var i = 0; i < node.nodes.length; ++i) {
				$scope.findCurrentNode(node.nodes[i]);
			}
		};

		$scope.findOne = function() {
			$scope.project = Projects.get({
				projectId: $stateParams.projectId
			}, function() {
				Headerpath.setProjectPath($scope.project.name);
				$scope.findCurrentNode($scope.project.children[0]);
			});
		};


		$scope.saveProject = function() {
			$scope.project.$update(function(response) {
				$scope.findOne();
			}, function(errorResponse) {
				console.log('Failed to save!');
			});
		};

		$scope.submitChat = function(node, msg) {
			$scope.currentNode.chat.push({'user':$scope.authentication.user.displayName, 'msg':msg});
			$scope.saveProject();
			$scope.chat = '';
		};

	}
]);