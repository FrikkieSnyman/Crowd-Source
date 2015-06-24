angular.module('main')
.controller('porjectCtrl', ['$scope', '$http', '$routeParams', '$mdDialog',
			function($scope, $http, $routeParams, $mdDialog) {
				$scope.treeData = [
		  {
			"name": "Top Level",
			"parent": "null",
			"children": [
		      {
			"name": "Level 2: A",
			"children": [
		          {
			"name": "Son of A",
			"parent": "Level 2: A"
		          },
		          {
			"name": "Daughter of A",
			"parent": "Level 2: A"
		          }
		        ]
		      },
		      {
			"name": "Level 2: B",
			"parent": "Top Level"
		      }
		    ]
		  }
		];

				// ************** Generate the tree diagram	 *****************
				var margin = {top: 20, right: 120, bottom: 20, left: 120},
					width = 960 - margin.right - margin.left,
					height = 500 - margin.top - margin.bottom;
				var i = 0;

				var tree = d3.layout.tree()
					.size([height, width]);

				var diagonal = d3.svg.diagonal()
					.projection(function(d) { return [d.y, d.x]; });

				var svg = d3.select("#chart").append("svg")
					.attr("width", width + margin.right + margin.left)
					.attr("height", height + margin.top + margin.bottom)
				.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				root = $scope.treeData[0];
  
				update(root);

				function update(source) {

					// Compute the new tree layout.
					var nodes = tree.nodes(root).reverse(),
						links = tree.links(nodes);

					// Normalize for fixed-depth.
					nodes.forEach(function(d) { d.y = d.depth * 180; });

					// Declare the nodes…
					var node = svg.selectAll("g.node")
						.data(nodes, function(d) { return d.id || (d.id = ++i); });

					// Enter the nodes.
					var nodeEnter = node.enter().append("g")
					.attr("class", "node")
			.attr("transform", function(d) { 
			return "translate(" + d.y + "," + d.x + ")"; });

					nodeEnter.append("circle")
						.attr("r", 10)
						.style("fill", "#fff");

					nodeEnter.append("text")
			.attr("x", function(d) { 
			return d.children || d._children ? -13 : 13; })
			.attr("dy", ".35em")
			.attr("text-anchor", function(d) { 
			return d.children || d._children ? "end" : "start"; })
			.text(function(d) { return d.name; })
			 .style("fill-opacity", 1);

					// Declare the links…
					var link = svg.selectAll("path.link")
						.data(links, function(d) { return d.target.id; });

					// Enter the links.
					link.enter().insert("path", "g")
						.attr("class", "link")
						.attr("d", diagonal);

				}

				$scope.confirm = false;
				var project = {'heading': $routeParams.id};
				$http({method:'POST', url:'/project', data: project}).success(function(data) {
		$scope.project = data[0];
		$scope.tree = $scope.project.children;
		$scope.treeData = $scope.project.children[0];

		$scope.rootIsEmpty = function() {
		//debugger;
		if (typeof $scope.project.children !== undefined) {
			if ($scope.project.children.length < 1) {
				return true;
			}
		} else {
			return false;
		}
	}
	});
				$scope.saveProject = function() {
		$http({method:'POST', url:'/addChild', data: $scope.project}).success(function() {

		});
	}
				$scope.addRootNode = function() {
		$scope.project.children.push({name: 'node', nodes: []});
	}
				$scope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
		// Appending dialog to document.body to cover sidenav in docs app
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
				newUrl = newUrl.split('#');
				$scope.goTo(newUrl[1]);
				$scope.confirm = true;
				//$scope.saveProject();
			}, function() {
				
			});
		}
		
	});
				$scope.saveProjectDialog = function() {

				}
			}]);
