const mongoose  = require('mongoose');
const queueWay = require('../utils/queueWay');
const Schema = mongoose.Schema;
var queue = new queueWay();

queueSchema = new Schema({
    current : {type: Number, default:0},
    total: {type:Number, default:0},
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

//0801，利用booth的queue找queue
queueSchema.query.byQueue = function(queue)  {
    return this.where({_id: queue});
};

module.exports = mongoose.model('Queue',queueSchema);