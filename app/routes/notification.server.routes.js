'use strict';

module.exports = function(app) {
	var notifications = require('../../app/controllers/notification.server.controller');

	app.route('/sendInvites')
		.post(notifications.sendInvites);
};