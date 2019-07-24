const mongoose  = require('mongoose');

const Schema = mongoose.Schema;

userSchema = new Schema({
    name: {type:String, default:'暫未提供'},
    email : {type:String, default:'暫未提供'},
    birthday: {type:String, default:'暫未提供'},
    gender: {type:String, default:'暫未提供'},
    phone: {type:String, default:'暫未提供'},
    password: {type:String, default:'暫未提供'},
    auth: {type:Boolean, default:false},
    line: [{type: Schema.Types.ObjectId, ref: 'UserQueue',default:[]}],
});

userSchema.statics.findOneByName = function(name) {
    return this.findOne({name:name});
}
userSchema.methods.findSameGender = function(){
    return this.model('User').find({gender:this.gender});
    // return this.find({gender:this.gender});
}
userSchema.query.byName = function(name){
    return this.where({name:name});
}
userSchema.statics.findOneByEmail = function(email){
    return this.findOne({email:email});
}
userSchema.query.updateAuth = function(email){
    return this.updateOne({email:email},{auth: true});
}


module.exports = mongoose.model('User',userSchema);
