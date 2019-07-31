const mongoose  = require('mongoose');

const Schema = mongoose.Schema;

messageSchema = new Schema({
    title: String,
    content: String,
});

messageSchema.query.byId = function(messageId)  {
    return this.where({_id: messageId});
};

module.exports = mongoose.model('Message', messageSchema);
