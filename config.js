/**
 * This file will contain all our configuration setting.
 * -Which port the server will run on.
 * -Database credentials.
 * -ect.
 */

exports.port = process.env.PORT || 8000;

exports.mongodb = {
	uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/test'
};
