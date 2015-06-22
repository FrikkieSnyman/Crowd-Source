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

	this.authenticate = function(request, response) {
		var User = mongoose.model('User', app.userSchema);

		User.findOne({email: request.body.email, password: request.body.password}, function(err, user) {
			if (err) {
				response.json({
					type: false,
					data: "Error occured: " + err
				});
			} else {
				if (user) {
				   response.json({
						type: true,
						data: user,
						token: user.token
					}); 
				} else {
					response.json({
						type: false,
						data: "Incorrect email/password"
					});
				}
			}
		});
	};

	this.login = function(request, response) {
		var User = mongoose.model('User', app.userSchema);

		// var userTemp = new User({
		// 	email : 'Andre',
		// 	password : '123',
		// 	token : ''
		// });

		// userTemp.save(function(err, data) {
		// 	if (err) {
		// 		console.log(err);
		// 	} else {
		// 		console.log('Saved : ', data);
		// 	}
		// });


		User.findOne({email: request.body.email, password: request.body.password}, function(err, user) {
			if (err) {
				response.json({
					type: false,
					data: "Error occured: " + err
				});
			} else {
				if (user) {
					response.json({
						type: false,
						data: "User already exists!"
					});
				} else {
					var userModel = new User();
					userModel.email = request.body.email;
					userModel.password = request.body.password;
					userModel.save(function(err, user) {
						user.token = jwt.sign(user, process.env.JWT_SECRET);
						user.save(function(err, user1) {
							response.json({
								type: true,
								data: user1,
								token: user1.token
							});
						});
					})
				}
			}
		});
	};

	this.getDetails = function(request, response) {
		var User = mongoose.model('User', app.userSchema);

		User.findOne({token: request.token}, function(err, user) {
			if (err) {
				response.json({
					type: false,
					data: "Error occured: " + err
				});
			} else {
				response.json({
					type: true,
					data: user
				});
			}
		});
	};

	return this;
};
