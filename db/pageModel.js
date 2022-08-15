const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
    pageIndex: {type: Number, required: true},
    pageUrl: {type: String, required: true},
    hints: {type: [String]}
});

const pageModel = mongoose.model('page', pageSchema);

module.exports = pageModel;