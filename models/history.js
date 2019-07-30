const mongoose  = require('mongoose');

const Schema = mongoose.Schema;

historySchema = new Schema({
    date:{type:Date, default: new Date()},
    historyVisitorTime:[],
    historyPost:[{type:Schema.Types.ObjectId, ref: 'Message',default:[]}],
    historyQueue:[{type:Schema.Types.ObjectId, ref: 'Queue',default:[]}]
});

module.exports = mongoose.model('History',historySchema,);