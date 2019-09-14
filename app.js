const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const chalk = require('chalk');
var flash = require('connect-flash');;
const session = require('express-session');
const passport = require('passport')

const log = console.log
const app = express();

// Passport config (./config/passport.js)
require('./config/passport')(passport)
// DB config
const db = require('./config/keys').mongoURI;
// connect db
mongoose.connect(db, { 
	useNewUrlParser: true,  
	useUnifiedTopology: true
	})
.then(() => log(chalk.bgWhite.blue('mongoDB connected')))
.catch(err => log(err));
//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static('public'));
// BodyParser
app.use(express.urlencoded({extended: false}))
// Express Session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  // cookie: { secure: true }
}))
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());
// Global Var
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg'),
	res.locals.error_msg = req.flash('error_msg'),
	res.locals.error= req.flash('error'),
	next();
});
//Routes
app.use('/', require('./routes/index'));
//Login routes
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, log(chalk.bgWhite.green(`Server start on port ${PORT}`)))