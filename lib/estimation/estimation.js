var absEstimation = require('./abstractedEstimation.js');

module.exports = function(app, mongoose) {

	this.estimate = function(request, response) {
		absEstimation.estimate(app, mongoose, request, response);
	};

	return this;
};
