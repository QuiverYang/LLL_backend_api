const mongoose  = require('mongoose');

const Schema = mongoose.Schema;

exhibitionSchema = new Schema({
    start:{type:Date, default: new Date()},
    end:{type:Date, default: new Date()},
    name:String,
    address:String,
    url:String,
    //預設回傳一個 UTC + 0 的 Date
    allPosts:[{type:Schema.Types.ObjectId, ref: 'Message',default:[]}],
    allStores:[{type:Schema.Types.ObjectId, ref: 'Store',default:[]}],
    
});

module.exports = mongoose.model('Exhibition',exhibitionSchema,);

