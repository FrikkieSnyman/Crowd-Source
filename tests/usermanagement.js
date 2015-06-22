var mongoose = Object;
var app = Object;
mongoose.model = function(a, b) {
	return function() {
		this.name = '';
		this.surname = '';
		this.save = function() {};
	};
};
app.userSchema = Object;

//require('./models.js')(app, mongoose);
var testUM = process.env.CUSTOM_COV ?
	require('../lib-cov/usermanagement/usermanagement.js')
	: require('../lib/usermanagement/usermanagement.js')(app, mongoose);

exports.testStuff = function(test) {
	var request = Object;
	request.body = {'name':'website', 'surname':'pew'};
	var response = Object;
	response.send = function(param) {};

	testUM.addName(request, response);
	test.done();
};
