const mongoose  = require('mongoose');

const Schema = mongoose.Schema;

exhibitionSchema = new Schema({
    name:String,
    start:{type:Date, default: new Date()},
    end:{type:Date, default: new Date()},
    //預設回傳一個 UTC + 0 的 Date
    allPosts:{type:[String], default:[]},
});

module.exports = mongoose.model('Exhibition',exhibitionSchema);
