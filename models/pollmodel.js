var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
    question: String,
    answers: [String],
    votes: [Number],
    user: String
});

module.exports = mongoose.model('Poll', Poll);