const mongoose  = require('mongoose');

const Schema = mongoose.Schema;

msgsaveSchema = new Schema({
    exhibition: String,
    name: String,
    title: String,
    content: String,
    web: String,
    time: String
});

module.exports = mongoose.model('Msgsave', messageSchema);
