var names = [];

exports = module.exports = function(app, mongoose) {
	/*
	The app gives us dependancy injection!
	 */

	this.addName = function(request, response) {
		console.log('Client is adding name ' + request.body.name);
		response.send(true);

		//Creating user to add to the database
		var User = mongoose.model('User', app.userSchema);

		var user = new User({
			name : request.body.name,
			surname : request.body.surname,
		});

		user.save(function(err, data) {
			if (err) {
				console.log(err);
			} else {
				console.log('Saved : ', data);
			}
		});

	};

	this.getNames = function(request, response) {
		//console.log('hello')
		var User = mongoose.model('User', app.userSchema);

		User.find(function(err, users) {
			if (err) {
				return console.error(err);
			}
			//console.log(users);
			response.send(users);
		});
		console.log('Client asked me for information');

	};

	return this;
};
