const mongoose  = require('mongoose');

const Schema = mongoose.Schema;

userSchema = new Schema({
    name : {
        firstName: String,
        lastName:String
    },
    email : String,
    birth: String,
    gender: String,
    phone: String,
    password: String,
    auth: Boolean
});

userSchema.statics.findOneByName = function(firstName, lastName) {
    return this.findOne({name:{firstName:firstName,lastName:lastName}});
}
userSchema.methods.findSameGender = function(){
    return this.model('User').find({gender:this.gender});
    // return this.find({gender:this.gender});
}
userSchema.query.byName = function(firstName, lastName){
    return this.where({name:{firstName:firstName,lastName:lastName}});
}
userSchema.statics.findOneByEmail = function(email){
    return this.findOne({email:email});
}
userSchema.query.updateAuth = function(email){
    return this.updateOne({email:email},{auth: true});
}


module.exports = mongoose.model('User',userSchema);
