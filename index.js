module.exports = process.env.SQUARE_COV
	? require('./lib-cov/square/square.js')
	: require('./lib/square/square.js')

module.exports = process.env.SQUARE_COV
	? require('./lib-cov/project/project.js')
	: require('./lib/project/project.js')