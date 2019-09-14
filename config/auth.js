module.exports = {
	ensureAuthenticated: function(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			req.flash('error_msg', 'Please log in to view this content');
			res.redirect('/users/login')
		}
	}
}