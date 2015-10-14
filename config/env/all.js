'use strict';

module.exports = {
	app: {
		title: 'Estimate Swarm',
		description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
		keywords: 'MongoDB, Express, AngularJS, Node.js'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/angular-material/angular-material.min.css',
				'public/lib/angular-ui-tree/dist/angular-ui-tree.min.css',
				'public/lib/textAngular/dist/textAngular.css',
				'public/lib/font-awesome/css/font-awesome.css'
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-cookies/angular-cookies.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-touch/angular-touch.js',
				'public/lib/angular-sanitize/angular-sanitize.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-material/angular-material.min.js',
				'public/lib/angular-animate/angular-animate.min.js',
				'public/lib/angular-aria/angular-aria.min.js',
				'public/lib/angular-ui-tree/dist/angular-ui-tree.min.js',
				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/d3/d3.js',
				'public/lib/textAngular/dist/textAngular-rangy.min.js',
				'public/lib/textAngular/dist/textAngular-sanitize.min.js',
				'public/lib/textAngular/dist/textAngular.min.js',
				'public/lib/angular-socket-io/socket.min.js',
				'public/lib/angular-socket.io-mock/angular-socket.io-mock.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
