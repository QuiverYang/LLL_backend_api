const mongoose  = require('mongoose');

const Schema = mongoose.Schema;

exhibitionSchema = new Schema({
    start:{type:Date, default: new Date()},
    end:{type:Date, default: new Date()},
    url:{type:String, default: ''},
    name:String,
    address:String,
    //預設回傳一個 UTC + 0 的 Date
    allPosts:[{type:Schema.Types.ObjectId, ref: 'Message',default:[]}],
    allStores:[{type:Schema.Types.ObjectId, ref: 'Store',default:[]}],

});
//0723，用展覽名稱查找
exhibitionSchema.query.byName = function(name)  {
    return this.where({name: name});
};
module.exports = mongoose.model('Exhibition',exhibitionSchema,);

