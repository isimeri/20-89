const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    progress: {type: Number, default: 1},
    wrongAnswers: {type: [Number], default: [0,0,0,0,0,0,0,0,0,0]},
    isAdmin: {type: Boolean, required: true, default: false}
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;