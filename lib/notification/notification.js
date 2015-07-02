var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'gmail.user@gmail.com',
		pass: 'userpass'
	}
});

exports = module.exports = function(app, mongoose) {
	this.sendInvites = function(request, response) {
		console.log(request);
	}
}
