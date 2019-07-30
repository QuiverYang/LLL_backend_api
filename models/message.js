const mongoose  = require('mongoose');

const Schema = mongoose.Schema;

messageSchema = new Schema({
    title: String,
    content: String,
    time: String
});

module.exports = mongoose.model('Message', messageSchema);
