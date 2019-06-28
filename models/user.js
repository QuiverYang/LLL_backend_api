const mongoose  = require('mongoose');

const Schema = mongoose.Schema;

userSchema = new Schema({
    name : {
        firstName: String,
        lastName:String
    },
    id : Number,
    birth: String,
    gender: String,
    phone: String,
    passsword: String
});

userSchema.statics.findByName = function(firstName, lastName) {
    return this.findOne({name:{firstName:firstName,lastName:lastName}});
}
userSchema.methods.findSameGender = function(){
    return this.model('User').find({gender:this.gender});
    // return this.find({gender:this.gender});
}
userSchema.query.byName = function(firstName, lastName){
    return this.where({name:{firstName:firstName,lastName:lastName}});
}


module.exports = mongoose.model('User',userSchema);
