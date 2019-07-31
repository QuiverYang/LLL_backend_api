const mongoose  = require('mongoose');

const Schema = mongoose.Schema;

historySchema = new Schema({
    date:{type:Date, default: new Date()},
    historyVisitorTime:[],
    historyPost:[],
    historyQueue:{type:Schema.Types.ObjectId, ref:'Queue', default:null},
});

module.exports = mongoose.model('History',historySchema,);