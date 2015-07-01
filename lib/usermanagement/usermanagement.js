var jwt = require('jsonwebtoken');
var secret = require('../../secret.js');

exports = module.exports = function(app, mongoose) {
	/*
	The app gives us dependancy injection!
	 */

	this.login = function(request, response) {
		var userModel = mongoose.model('User', app.userSchema);

		var username = request.body.username || '';
		var password = request.body.password || '';
	 
		if (username == '' || password == '') {
			return response.sendStatus(401);
		}
	 
		userModel.findOne({email: username, password: password}, function(err, user) {
			if (err) {
				console.log(err);
				return response.sendStatus(401);
			}

			// console.log(user);

			if (user === null) {
				console.log('User ' + username + ' does not exsist');
				return response.sendStatus(401);
			} else {
				console.log('User: ' + user.email + ' has logged in');
	 
				// user.comparePassword(password, function(isMatch) {
				// 	if (!isMatch) {
				// 		console.log("Attempt failed to login with " + user.username);
				// 		return response.send(401);
				// 	}
		 
				var token = jwt.sign({id: user}, secret.secretToken, {expiresInMinutes: 60});
		 
				return response.json({token:token});
				// });
			}
		});
	};

	this.getAllUsers = function(request, response) {
		var User = mongoose.model('User', app.userSchema);

		var query = User.find({}).select('email -_id');

		query.exec(function(err, users) {
			if (err) {
				return console.error(err);
			}
			response.send(users);
		});
	};

	return this;
};
