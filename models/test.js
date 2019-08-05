const mongoose  = require('mongoose');

const Schema = mongoose.Schema;

testSchema = new Schema({
    name:String,
    nicknames:[],
});

module.exports = mongoose.model('Test',testSchema);