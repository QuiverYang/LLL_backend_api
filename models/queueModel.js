const mongoose  = require('mongoose');
const queueWay = require('../utils/queueWay');

const Schema = mongoose.Schema;

queueSchema = new Schema({
    storeName : String,
    ticket : Number,
    visitor: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

queueSchema.statics.findByAccount = function(account) {
    return this.findOne({account:account});
}
queueSchema.query.byCompany = function(company){
    return this.where({company:company});
}

module.exports = mongoose.model('QueueModel',queueSchema);