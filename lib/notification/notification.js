var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'estimateswarm@gmail.com',
		pass: 'estimatingtilltheend'
	}
});

exports = module.exports = function(app, mongoose) {
	this.sendInvites = function(request, response) {
		var users = request.body.users;
		var projectName = request.body.projectName.replace(/ /g, '%20');
		var pageAddress = 'http://localhost:8080/#/project/' + projectName;

		if (users.length <= 0) {
			console.log('No one selected for estimation');
		} else {
			console.log('Attempting to send invites to:');
			console.log(users);

			var mailText = 'You have been invited to estimate on project:\r\n' +
							request.body.projectName + '. \r\n \r\n' +
							'Please go to the following page to make an estimation ' +
							pageAddress;

			var mailHTML = 'You have been invited to estimate on project:<br /><b>' +
							request.body.projectName + '</b>. <br /><br />' +
							'Please go to the following page to make an estimation ' +
							pageAddress;

			var mailOptions = {
				from: 'Estimate Swarm <estimateswarm@gmail.com>', // sender address
				to: users, // list of receivers
				subject: 'Estimation Invite', // Subject line
				text:  mailText,// plaintext body
				html:  mailHTML// html body
			};

			transporter.sendMail(mailOptions, function(error, info) {
				if (error) {
					return console.log(error);
				}
				console.log('Message sent: ' + info.response);

			});
		}
	}

	return this;
}
