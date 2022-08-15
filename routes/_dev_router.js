const express = require('express');
const bcrypt = require('bcryptjs')
const userModel = require('../db/userModel.js');
const pageModel = require('../db/pageModel.js');
const triviaModel = require('../db/triviaModel.js');
const router = express.Router();

router.use(express.static(process.cwd() + '/public'));

router.get('/', (req, res) => {
    res.render('dev', {users: [], pages: [], trivia: []});
    // res.render('login');
});
router.get('/getUsers', async (req, res) => {
    const users = await userModel.find();
    res.render('dev', {users: users, pages: [], trivia: []});
});
router.get('/getPages', async (req, res) => {
    const pages = await pageModel.find();
    res.render('dev', {users: [], pages: pages, trivia: []});
});
router.post('/addUser', async (req, res) => {
    const username = req.body.username;
    const password = await bcrypt.hash(req.body.password, 10);

    const newUser = new userModel({
        username: username,
        password: password
    });

    await newUser.save();
    res.send('new user added ez gg');
});

router.post('/addPage', async (req, res) => {
    const index = req.body.pageIndex;
    const hints = (req.body.hints).split(';');
    const pageUrl = req.body.pageUrl;

    const newPage = new pageModel({
        pageIndex: index,
        pageUrl: pageUrl,
        hints: hints
    });

    await newPage.save();
    res.send('new page added ez gg');
});

router.get('/getNews', async (req, res) => {
    const trivia = await triviaModel.findOne();
    //probabil trivia va fi un obiect inauntrul unui array, oleaca problematic
    res.render('dev', {users: [], pages: [], trivia: trivia.newsArr});
});
router.get('/getDidYouKnow', async (req, res) => {
    const trivia = await triviaModel.findOne();
    res.render('dev', {users: [], pages: [], trivia: trivia.didYouKnowArr});
});

router.post('/addNews', async (req, res) => {
    const trivia = await triviaModel.findOne();
    const newNews = (req.body.news).split(';');
    trivia.newsArr = trivia.newsArr.concat(newNews);

    await trivia.save();
    res.send('more news added gg');
});
router.post('/addDidYouKnow', async (req, res) => {
    const trivia = await triviaModel.findOne();
    const newDidYouKnow = (req.body.didYouKnow).split(';');
    trivia.didYouKnowArr = trivia.didYouKnowArr.concat(newDidYouKnow);

    await trivia.save();
    res.send('more "did you know" added gg');
});

module.exports = router;