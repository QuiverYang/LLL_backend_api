const mongoose  = require('mongoose');
const queueWay = require('../utils/queueWay');
const Schema = mongoose.Schema;
var queue = new queueWay();

userqueueSchema = new Schema({
    myNum : {type: Number, default:0},
    store:{type: Schema.Types.ObjectId, ref: 'Store'}
});


module.exports = mongoose.model('UserQueue',userqueueSchema);