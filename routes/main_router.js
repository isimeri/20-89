const express = require('express');
const router = express.Router();
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const userModel = require('../db/userModel.js');
const pageModel = require('../db/pageModel.js');
const triviaModel = require('../db/triviaModel.js');


//middleware - check if logged in or not
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

router.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));
router.use(flash());
router.use(passport.initialize());
router.use(passport.session());


//===================ROUTES========================

router.get('/', checkAuth, async (req, res) => {
	const pages = await pageModel.find().select({pageUrl: 1, pageIndex: 1}).sort({pageIndex: 1});
	// console.log('in / ', req.user);
	const trivia = await triviaModel.findOne();
	const newsIndex = Math.floor(Math.random() * trivia.newsArr.length);
	const didYouKnowIndex = Math.floor(Math.random() * trivia.didYouKnowArr.length);
    res.render('index', { user: req.user, pages: pages, news: trivia.newsArr[newsIndex], didYouKnow: trivia.didYouKnowArr[didYouKnowIndex] });
});

router.get('/login', checkNotAuth, (req, res) => {
    res.render('login', );
});

router.post('/login', checkNotAuth, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));
router.get('/logout', (req, res) => {
    req.logOut((err) => {
		if (err) { return next(err); }
		res.redirect('/login');
	  });
});

router.get('/login_a', checkNotAuth, (req, res) => {
	res.render('login_a');
});

router.get('/login_b', checkNotAuth, (req, res) => {
	res.render('login_b');
});
router.get('/instructions', checkAuth, (req, res) => {
	res.render('instructions');
})

router.get('/puzzles/:id', checkAuth, async (req, res) => {
	// req.user.isAdmin = true; /////// fix this
	if(req.params.id <= 10 && req.params.id >= 1){
		const pageIndex = req.params.id;
		const page = await pageModel.findOne({pageIndex}).select({hints: 1});
		const hintsToSend = page.hints.slice(0, Math.floor(req.user.wrongAnswers[0] / 4));
		if(req.user.isAdmin === true){
			return res.render(`puzzle${pageIndex}`, {hints: hintsToSend, message: '', progress: req.user.progress, pageIndex, isAdmin: req.user.isAdmin});
		}
		else if(pageIndex > req.user.progress){
			return res.status(403).render('403', {username: req.user.username});
		}
		return res.render(`puzzle${pageIndex}`, {hints: hintsToSend, message: '', progress: req.user.progress, pageIndex, isAdmin: req.user.isAdmin});
	}
	res.render('404', {username: req.user.username});
});
//----------------PAGE-1----------------

// router.get('/puzzle1', checkAuth, async (req, res) => {
// 	const pageIndex = 1;
// 	const page = await pageModel.findOne({pageIndex}).select({hints: 1});
// 	const hintsToSend = page.hints.slice(0, Math.floor(req.user.wrongAnswers[0] / 4));
// 	res.render(`puzzle${pageIndex}`, {hints: hintsToSend, message: '', pageIndex, user: req.user});
// 	 //for sum fuken reason, i must pass message and success or else ejs will say bruh
// });
router.post('/puzzles/1', checkAuth, async (req, res) => {
	//maybe set hte asnwers in the db and pull them to check against teh submitted answer
	const pageIndex = 1;
	const page = await pageModel.findOne({pageIndex}).select({hints: 1});
	const hintsToSend = page.hints.slice(0, Math.floor(req.user.wrongAnswers[0] / 4));
	const answer = (req.body.answer).trim().toLowerCase();
	const correctAnswers = ['dodon', 'igor dodon', 'igari'];
	if(correctAnswers.includes(answer)){
		req.user.progress = 2;
		await userModel.updateOne({_id: req.user.id}, {progress: req.user.progress});
		res.render('puzzle1', {hints: hintsToSend, progress: req.user.progress, message: 'Adevarat!', pageIndex});
	} else {
		req.user.wrongAnswers[0] += 1;
		await userModel.updateOne({_id: req.user.id}, {wrongAnswers: req.user.wrongAnswers});
		res.render('puzzle1', {hints: hintsToSend, progress: req.user.progress, message: 'Sigur ca nu', pageIndex});
	}
});

//----------------PAGE-2----------------

// router.get('/puzzle2', checkAuth, async (req, res) => {
// 	const pageIndex = 2;
// 	const page = await pageModel.findOne({pageIndex}).select({hints: 1});
// 	const hintsToSend = page.hints.slice(0, Math.floor(req.user.wrongAnswers[0] / 4));
// 	res.render('puzzle2', {hints: hintsToSend, message: '', pageIndex, user: req.user});
// 	 //for sum fuken reason, i must pass message and success or else ejs will say bruh
// });
router.post('/puzzles/2', checkAuth, async (req, res) => {
	//maybe set hte asnwers in the db and pull them to check against teh submitted answer
	const pageIndex = 2;
	const page = await pageModel.findOne({pageIndex}).select({hints: 1});
	const hintsToSend = page.hints.slice(0, Math.floor(req.user.wrongAnswers[0] / 4));
	const answer = (req.body.answer).trim().toLowerCase();
	const correctAnswers = ['opt'];
	if(correctAnswers.includes(answer)){
		req.user.progress = 3;
		await userModel.updateOne({_id: req.user.id}, {progress: req.user.progress});
		// console.log('in /puzzle2 ', req.user)
		res.render('puzzle2', {hints: hintsToSend, progress: req.user.progress, message: 'Adevarat!', pageIndex});
	} else {
		req.user.wrongAnswers[1] += 1;
		await userModel.updateOne({_id: req.user.id}, {wrongAnswers: req.user.wrongAnswers});
		res.render('puzzle2', {hints: hintsToSend, progress: req.user.progress, message: 'Sigur ca nu', pageIndex});
	}
});

//----------------PAGE-3----------------

// router.get('/puzzle3', checkAuth, (req, res) => {
// 	res.render('puzzle3', {message: '', success: false});
// 	 //for sum fuken reason, i must pass message and success or else ejs will say bruh
// });
router.post('/puzzles/3', checkAuth, async (req, res) => {
	//maybe set hte asnwers in the db and pull them to check against teh submitted answer
	const pageIndex = 3;
	const page = await pageModel.findOne({pageIndex}).select({hints: 1});
	const hintsToSend = page.hints.slice(0, Math.floor(req.user.wrongAnswers[0] / 4));
	const regex = /^[-,._;:'"\s]*nicolae[-,._;:'"\s]*cel[-,._;:'"\s]*invizibil[-,._;:'"\s]*$/i
	const answer = (req.body.answer).trim().toLowerCase();
	if(regex.test(answer)){
		req.user.progress = 4;
		await userModel.updateOne({_id: req.user.id}, {progress: req.user.progress});
		// console.log('in /puzzle3 ', req.user)
		res.render('puzzle3', {hints: hintsToSend, progress: req.user.progress, message: 'Adevarat!', pageIndex});
	} else {
		req.user.wrongAnswers[2] += 1;
		await userModel.updateOne({_id: req.user.id}, {wrongAnswers: req.user.wrongAnswers});
		res.render('puzzle3', {hints: hintsToSend, progress: req.user.progress, message: 'Sigur ca nu', pageIndex});
	}
});


//----------------PAGE-4----------------

// router.get('/puzzle4', checkAuth, (req, res) => {
// 	res.render('puzzle4', {message: '', success: false});
// 	 //for sum fuken reason, i must pass message and success or else ejs will say bruh
// });
router.post('/puzzles/4', checkAuth, async (req, res) => {
	//maybe set hte asnwers in the db and pull them to check against teh submitted answer
	const pageIndex = 4;
	const page = await pageModel.findOne({pageIndex}).select({hints: 1});
	const hintsToSend = page.hints.slice(0, Math.floor(req.user.wrongAnswers[0] / 4));
	const regex = /^[-,._;:'"\s]*dragostea[-,._;:'"\s]*dintr-e[-,._;:'"\s]*barbat[-,._;:'"\s]*si[-,._;:'"\s]*femeie[-,._;:'"\s]*$/i
	const answer = (req.body.answer).trim().toLowerCase();
	if(regex.test(answer)){
		req.user.progress = 5;
		await userModel.updateOne({_id: req.user.id}, {progress: req.user.progress});
		console.log('in /puzzle4 ', req.user)
		res.render('puzzle4', {hints: hintsToSend, progress: req.user.progress, message: 'Adevarat!', pageIndex});
	} else {
		req.user.wrongAnswers[3] += 1;
		await userModel.updateOne({_id: req.user.id}, {wrongAnswers: req.user.wrongAnswers});
		res.render('puzzle4', {hints: hintsToSend, progress: req.user.progress, message: 'Sigur ca nu', pageIndex});
	}
});

//----------------PAGE-5----------------

// router.get('/puzzle5', checkAuth, (req, res) => {
// 	res.render('puzzle5', {message: '', success: false});
// 	 //for sum fuken reason, i must pass message and success or else ejs will say bruh
// });
router.post('/puzzles/5', checkAuth, async (req, res) => {
	//maybe set hte asnwers in the db and pull them to check against teh submitted answer
	const pageIndex = 5;
	const page = await pageModel.findOne({pageIndex}).select({hints: 1});
	const hintsToSend = page.hints.slice(0, Math.floor(req.user.wrongAnswers[0] / 4));
	const regex = /[a-zA-Z0-9]/gi;
	const rawAnswer = (req.body.answer).trim().toLowerCase();
	const answer = rawAnswer.match(regex);
	const correctAnswer = ['3','6','b','e','g'];
	if(correctAnswer.every(item => answer.includes(item)) && answer.every(item => correctAnswer.includes(item))){
		req.user.progress = 6;
		await userModel.updateOne({_id: req.user.id}, {progress: req.user.progress});
		console.log('in /puzzle5 ', req.user)
		res.render('puzzle5', {hints: hintsToSend, progress: req.user.progress, message: 'Adevarat!', pageIndex });
	} else {
		req.user.wrongAnswers[4] += 1;
		await userModel.updateOne({_id: req.user.id}, {wrongAnswers: req.user.wrongAnswers});
		res.render('puzzle5', {hints: hintsToSend, progress: req.user.progress, message: 'Sigur ca nu', pageIndex});
	}
});

//----------------PAGE-6----------------

// router.get('/puzzle6', checkAuth, (req, res) => {
// 	res.render('puzzle6', {message: '', success: false});
// 	 //for sum fuken reason, i must pass message and success or else ejs will say bruh
// });
router.post('/puzzles/6', checkAuth, async (req, res) => {
	//maybe set hte asnwers in the db and pull them to check against teh submitted answer
	const pageIndex = 6;
	const page = await pageModel.findOne({pageIndex}).select({hints: 1});
	const hintsToSend = page.hints.slice(0, Math.floor(req.user.wrongAnswers[0] / 4));
	const answer = (req.body.answer).trim().toLowerCase();
	const correctAnswers = ['nioza'];
	if(correctAnswers.includes(answer)){
		req.user.progress = 7;
		await userModel.updateOne({_id: req.user.id}, {progress: req.user.progress});
		console.log('in /puzzle6 ', req.user)
		res.render('puzzle6', {hints: hintsToSend, progress: req.user.progress, message: 'Adevarat!', pageIndex});
	} else {
		req.user.wrongAnswers[5] += 1;
		await userModel.updateOne({_id: req.user.id}, {wrongAnswers: req.user.wrongAnswers});
		res.render('puzzle6', {hints: hintsToSend, progress: req.user.progress, message: 'Sigur ca nu', pageIndex});
	}
});

//----------------PAGE-7----------------

// router.get('/puzzle7', checkAuth, (req, res) => {
// 	res.render('puzzle7', {message: '', success: false});
// 	 //for sum fuken reason, i must pass message and success or else ejs will say bruh
// });
router.post('/puzzles/7', checkAuth, async (req, res) => {
	//maybe set hte asnwers in the db and pull them to check against teh submitted answer
	const pageIndex = 7;
	const page = await pageModel.findOne({pageIndex}).select({hints: 1});
	const hintsToSend = page.hints.slice(0, Math.floor(req.user.wrongAnswers[0] / 4));
	const answer = (req.body.answer).trim().toLowerCase();
	const correctAnswers = ['paracetamol'];
	if(correctAnswers.includes(answer)){
		req.user.progress = 8;
		await userModel.updateOne({_id: req.user.id}, {progress: req.user.progress});
		console.log('in /puzzle7 ', req.user)
		res.render('puzzle7', {hints: hintsToSend, progress: req.user.progress, message: 'Adevarat!', pageIndex});
	} else {
		req.user.wrongAnswers[6] += 1;
		await userModel.updateOne({_id: req.user.id}, {wrongAnswers: req.user.wrongAnswers});
		res.render('puzzle7', {hints: hintsToSend, progress: req.user.progress, message: 'Sigur ca nu', pageIndex});
	}
});

//----------------PAGE-8----------------

// router.get('/puzzle8', checkAuth, (req, res) => {
// 	res.render('puzzle8', {message: '', success: false});
// 	 //for sum fuken reason, i must pass message and success or else ejs will say bruh
// });
router.post('/puzzles/8', checkAuth, async (req, res) => {
	//maybe set hte asnwers in the db and pull them to check against teh submitted answer
	const pageIndex = 8;
	const page = await pageModel.findOne({pageIndex}).select({hints: 1});
	const hintsToSend = page.hints.slice(0, Math.floor(req.user.wrongAnswers[0] / 4));
	const answer = (req.body.answer).trim().toLowerCase();
	const correctAnswers = ['vadalei', 'vodolei', 'varsator'];
	if(correctAnswers.includes(answer)){
		req.user.progress = 9;
		await userModel.updateOne({_id: req.user.id}, {progress: req.user.progress});
		console.log('in /puzzle8 ', req.user)
		res.render('puzzle8', {hints: hintsToSend, progress: req.user.progress, message: 'Adevarat!', pageIndex});
	} else {
		req.user.wrongAnswers[7] += 1;
		await userModel.updateOne({_id: req.user.id}, {wrongAnswers: req.user.wrongAnswers});
		res.render('puzzle8', {hints: hintsToSend, progress: req.user.progress, message: 'Sigur ca nu', pageIndex});
	}
});

//----------------PAGE-9----------------

// router.get('/puzzle9', checkAuth, (req, res) => {
// 	res.render('puzzle9', {message: '', success: false});
// 	 //for sum fuken reason, i must pass message and success or else ejs will say bruh
// });
router.post('/puzzles/9', checkAuth, async (req, res) => {
	//maybe set hte asnwers in the db and pull them to check against teh submitted answer
	const pageIndex = 9;
	const page = await pageModel.findOne({pageIndex}).select({hints: 1});
	const hintsToSend = page.hints.slice(0, Math.floor(req.user.wrongAnswers[0] / 4));
	const answer = (req.body.answer).trim().toLowerCase();
	const correctAnswers = ['nimic', 'nimica', 'nica', 'nu'];
	if(correctAnswers.includes(answer)){
		req.user.progress = 10;
		await userModel.updateOne({_id: req.user.id}, {progress: req.user.progress});
		console.log('in /puzzle9 ', req.user)
		res.render('puzzle9', {hints: hintsToSend, progress: req.user.progress, message: 'Adevarat!', pageIndex});
	} else {
		req.user.wrongAnswers[8] += 1;
		await userModel.updateOne({_id: req.user.id}, {wrongAnswers: req.user.wrongAnswers});
		res.render('puzzle9', {hints: hintsToSend, progress: req.user.progress, message: 'Sigur ca nu', pageIndex});
	}
});


//----------------PAGE-10----------------

// router.get('/puzzle10', checkAuth, (req, res) => {
// 	res.render('puzzle10', {message: '', success: false});
// 	 //for sum fuken reason, i must pass message and success or else ejs will say bruh
// });
router.post('/puzzles/10', checkAuth, async (req, res) => {
	//maybe set hte asnwers in the db and pull them to check against teh submitted answer
	const pageIndex = 10;
	const page = await pageModel.findOne({pageIndex}).select({hints: 1});
	const hintsToSend = page.hints.slice(0, Math.floor(req.user.wrongAnswers[0] / 4));
	const answerX = (req.body.answerX).trim().toLowerCase();
	const answerY =	(req.body.answerY).trim().toLowerCase();
	const correctAnswers = {
		x: 'otorinolaringolog',
		y: 'sternocleidomastoidian'
	};
	if(correctAnswers.x === answerX && correctAnswers.y === answerY){
		req.user.progress = 11;
		await userModel.updateOne({_id: req.user.id}, {progress: req.user.progress});
		console.log('in /puzzle10 ', req.user)
		res.render('puzzle10', {hints: hintsToSend, progress: req.user.progress, message: 'Adevarat!', pageIndex});
	} else {
		req.user.wrongAnswers[9] += 1;
		await userModel.updateOne({_id: req.user.id}, {wrongAnswers: req.user.wrongAnswers});
		res.render('puzzle10', {hints: hintsToSend, progress: req.user.progress, message: 'Sigur ca nu', pageIndex});
	}
});

//-------------------------------------------------------------------
//-----------------------------SIDE-ROUTES---------------------------
//-------------------------------------------------------------------
router.get('/epic_life_quote', checkAuth, (req, res) => {
	res.render('puzzle1_a_epic_life_quote');
});
router.get('/sticky_notes', checkAuth, (req, res) => {
	res.render('puzzle3_a_sticky_notes');
});
router.get('/jessica_alba', checkAuth, (req, res) => {
	res.render('puzzle3_b_jessica_alba');
});
router.get('/heart', checkAuth, (req, res) => {
	res.render('puzzle4_a_heart');
});
router.get('/epic_life_quote2', checkAuth, (req, res) => {
	res.render('puzzle4_b_epic_marina_quote');
});
router.get('/relatabil', checkAuth, (req, res) => {
	res.render('puzzle8_a_vadalei', {msg: '', vadaleiString: ''});
});
router.post('/relatabil', checkAuth, (req, res) => {
	const pass = req.body.p8pass;
	if(pass === "oocicmizdt"){
		res.render('puzzle8_a_vadalei', {msg: 'Pare-se ca da. Ceea dupa ce ai venit se afla mai jos.', vadaleiString: 'Ia tut cac pasmatrel vacrug, slushte, mi sabralisi tacaia camanda serioznih vadaleev :D'});
	} else {
		res.render('puzzle8_a_vadalei', {msg: 'Pare-se ca nu. Mai cutreiera taramul si vino inapoi cand ai ceea ce trebuie', vadaleiString: ''});
	}
});

module.exports = router;