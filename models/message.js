const mongoose  = require('mongoose');

const Schema = mongoose.Schema;

messageSchema = new Schema({
    title:{type:String,default:"主題未命名"},
    content:{type:String,default:"內容空白"}
});
messageSchema.query.byId = function(messageId)  {
    return this.where({_id: messageId});
};
module.exports = mongoose.model('Message',messageSchema);