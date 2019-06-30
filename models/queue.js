const mongoose  = require('mongoose');
const queueWay = require('../utils/queueWay');
const Schema = mongoose.Schema;
var queue = new queueWay();

queueSchema = new Schema({
    exhibitionName:{type: String,default:''},
    storeName : String,
    ticket : Number,
    visitor: [{type: Schema.Types.ObjectId, ref: 'User',default:[]}]
});

queueSchema.statics.findByExhibitionName = function(exhibitionName) {
    return this.find({exhibitionName:exhibitionName});
}
queueSchema.statics.findOneByStoreName = function(storeName){
    return this.findOne({storeName:storeName});
}

queueSchema.methods.updateVisitor = function() {
    return this.model('Queue').updateOne({storeName:this.storeName},{$set:{}});
}

module.exports = mongoose.model('Queue',queueSchema);