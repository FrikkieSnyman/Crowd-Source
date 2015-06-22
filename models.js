/**
 * We will import this file into main.js to load all the various schema's
 */

exports = module.exports = function(app, mongoose) {
	require('./schema/User.js')(app, mongoose);
	require('./schema/Project.js')(app, mongoose);
};
