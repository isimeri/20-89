if(process.env.NODE_ENV !== 'production'){
	require('dotenv').config();
}
const express = require('express');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const passportInit = require('./passport-config.js');
const mainRouter = require('./routes/main_router.js');
const devRouter = require('./routes/_dev_router.js');
const connectDB = require('./db/connectDB.js');
const server = express();
const userModel = require('./db/userModel.js');
const port = process.env.PORT||5000;

passportInit(passport, 
	async (username) => {
		const user = await userModel.findOne({username: username});
		return user;
	},
	async (id) => { return await userModel.findOne({_id: id})}
);
connectDB();

server.set('view engine', 'ejs');

server.use(express.static(process.cwd() + '/public'));
server.use('/puzzles', express.static(process.cwd() + '/public'));
server.use(express.urlencoded({extended: false}));
server.use('/', mainRouter);
server.use('/dev', devRouter);
server.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));
server.use(flash());
server.use(passport.initialize());
server.use(passport.session());

function checkAuth(req, res, next){
	if(req.isAuthenticated()){
			return next();
	}
	res.redirect('/login');
}
function checkNotAuth(req, res, next){
	if(req.isAuthenticated()){
			return res.redirect('/');
	}
	next();
}

// server.get('/', checkAuth, (req, res) => {
//     res.render('index');
// });

// server.get('/login', checkNotAuth, (req, res) => {
//     res.render('login');
// });

server.all('*', (req, res) => {
	const user = req.user;
	let username;
	if(user){
		username = user.username;
	} else {
		username = "stimate concetatean";
	}
	res.render('404', {username});
});
server.listen(port, () => {
    console.log(`server listening on port ${port}`);
});