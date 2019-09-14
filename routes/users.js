const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

//validation 
let errors = [{ msg: '' }];

//Login Page
router.get('/login', (req, res) => {res.render('login' , {errors: errors})});
// Register Page

router.get('/register', (req, res) => {res.render('register', {errors: errors})});

// Register Handle
router.post('/register', (req, res) => {
	// reset validation
	let errors = [];
	const { name, email, password, password2 } = req.body;

	// Check required fields
	if(!name || !email || !password || !password2){
		errors.push({msg: 'Please fill in all fields'})
	}

	// Check Password match
	if(password !== password2){
		errors.push({ msg: 'Password do not match'})
	}

	// Check Password length
	if(password.length < 8){
		errors.push({ msg : 'password should atleast 8 characters or more'})
	}

	if(errors.length > 0){
		res.render('register', {
			errors,
			name,
			email,
			password,
			password2
		});

	} else {
		// Validation passed 
		User.findOne({email: email})
		.then(user => {
			if(user){
				//User Exists
					errors.push({msg: 'Email is already registered'})
					res.render('register', {
					errors,
					name,
					email,
					password,
					password2
				});
			} else {
				// Stored data in user
				const newUser = new User({
					name,
					email,
					password
				});

				// Hash Password
				bcrypt.genSalt(10, (err, salt) => 
					bcrypt.hash(newUser.password, salt, (err, hash)=>{
						if(err) throw err;
						// SET password to hashed 
						newUser.password = hash;
						newUser.save()
							.then(user => {
								req.flash('success_msg', 'You are now registered and can now login!');
								res.redirect('/users/login');
							})
							.catch(err => console.log(err))
				}))
				
			}// if end tag
		}); // thnd end tag
	}
});

// Login Handle
router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/dashboard',
		failureRedirect: '/users/login',
		failureFlash: true
	})(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success_msg', 'You are successfully logged out');
	res.redirect('/users/login');
})

module.exports = router;