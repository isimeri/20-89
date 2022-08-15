const mongoose = require('mongoose');

const triviaSchema = new mongoose.Schema({
    newsArr: [String],
    didYouKnowArr: [String]
});

const triviaModel = mongoose.model('trivia', triviaSchema);

module.exports = triviaModel;