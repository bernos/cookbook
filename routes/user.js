var user = require('../models/user.js');

/*
 * GET users listing.
 */

exports.list = function(req, res){

	var me = new user.User({
		firstName: "Brendan",
		lastName: "McMahon"
	});

	me.save(function(err, me) {
		if (err) {
			console.log("didnt save me!");
			throw err;
		} else {
			console.log("created me!");
		}
	});

	res.send("respond with a resource");
};

exports.create = function(req, res, next) {
	console.log(req.body)
	var newUser = new user.User(req.body);
	newUser.save(function(err) {
		if (err) {
			next(err);
		} else {
			res.send(newUser);
		}
	})

}