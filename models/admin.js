const mongoose  = require('mongoose');

const Schema = mongoose.Schema;

adminSchema = new Schema({
    id : String,
    email:String,
    company:String,
    account: String,
    password: String
});

adminSchema.statics.findByAccount = function(account) {
    return this.findOne({account:account});
}
adminSchema.query.byCompany = function(company){
    return this.where({company:company});
}

module.exports = mongoose.model('Admin',adminSchema);
