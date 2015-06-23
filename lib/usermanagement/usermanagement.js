var names = [];
var jwt = require('jsonwebtoken');
var secret = require('../../secret.js');

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

	this.login = function(request, response) {
		var userModel = mongoose.model('User', app.userSchema);

		var username = request.body.username || '';
		var password = request.body.password || '';
	 
		if (username == '' || password == '') {
			return response.send(401);
		}
	 
		userModel.findOne({username: username, password:password}, function(err, user) {
			if (err) {
				console.log(err);
				return response.send(401);
			}

			console.log('User: ' + username + ' has logged in');
	 
			// user.comparePassword(password, function(isMatch) {
			// 	if (!isMatch) {
			// 		console.log("Attempt failed to login with " + user.username);
			// 		return response.send(401);
			// 	}
	 
				var token = jwt.sign({id: user}, secret.secretToken, { expiresInMinutes: 60 });
	 
				return response.json({token:token});
			// });
	 
		});
	};

	return this;
};
