const mongoose  = require('mongoose');
const Schema = mongoose.Schema;

storeSchema = new Schema({
    name: {type:String, default:'未命名'},
    password:{type:String,default:'0000'},
    phone: {type:String, default:'暫未提供'},
    info: {type:String, default:'暫未提供'},
    address:{type:String, default:'暫未提供'},
    email:{type:String, default:'暫未提供'},
    currentExhibit: {type:String, default:''},
    boothNo:{type:String, default:'暫未提供'},
    imgURL:{type:String, default:'暫未提供'},
    queue: {type: Schema.Types.ObjectId, ref: 'Queue'}
})

storeSchema.query.byName = function(name){
    return this.where({name:name});
}

storeSchema.statics.findOneByName = function(StoreName){
    return this.findOne({name:StoreName});
}
storeSchema.statics.findAllStores = function(){
    return this.model('Store').find({});
}
storeSchema.statics.findOneByEmail = function(email){
    return this.findOne({email:email});
}
storeSchema.statics.findByCurrentExhibition = function(exhibitionName){
    return this.find({currentExhibit:exhibitionName});
}

module.exports = mongoose.model('Store',storeSchema);
