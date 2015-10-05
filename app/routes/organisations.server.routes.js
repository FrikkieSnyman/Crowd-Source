'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var organisations = require('../../app/controllers/organisations.server.controller');

	// Organisations Routes
	app.route('/organisations')
		.get(organisations.list)
		.post(users.requiresLogin, organisations.create);

	app.route('/organisations/:organisationId')
		.get(organisations.read)
		.put(users.requiresLogin, organisations.hasAuthorization, organisations.update)
		.delete(users.requiresLogin, organisations.hasAuthorization, organisations.delete);

	// Finish by binding the Organisation middleware
	app.param('organisationId', organisations.organisationByID);
};
