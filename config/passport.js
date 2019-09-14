const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User Modal
const User = require('../models/User');

module.exports = function(passport) {
	// passpor username and password config
	passport.use(
		new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
			//Match User 
			User.findOne({ email: email})
			.then(user => {
				// check user in User db
				if(!user){
					return done(null, false, {message: 'The email is not registered'});
				}
				// Match password
				bcrypt.compare(password, user.password, (err, isMatch) => {
					if(err) throw err;
					if(isMatch) {
						return done(null, user);
					} else {
						return done(null, false, {message : 'Password is incorrect'});
					}
				}) // bcrypt end tag
			})
			.catch(err => console.log(err));
		})
	); // end of username and password config
	passport.serializeUser((user, done) => {
  		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
 		User.findById(id, (err, user) => {
    		done(err, user);
  		});
	});
}