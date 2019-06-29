const mongoose  = require('mongoose');
const Schema = mongoose.Schema;

storeSchema = new Schema({
    name: {type:String, default:'未命名'},
    phone: {
        cellphone: {type:String, default:'暫未提供'},
        fixphone:{type:String, default:'暫未提供'}
    },
    info: {type:String, default:'暫未提供'},
    address:{type:String, default:'暫未提供'},
    openingTime:{
        open:{type:String, default:'暫未提供'},
        close:{type:String, default:'暫未提供'}
    },
    email:{type:String, default:'暫未提供'},
    currentExhibit: {type:String, default:''},
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

module.exports = mongoose.model('Store',storeSchema);
