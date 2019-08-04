const mongoose  = require('mongoose');
const Schema = mongoose.Schema;

storeSchema = new Schema({
    name: {type:String, default:'未命名'},
    password:{type:String,default:'0000'},
    phone: {type:String, default:'暫未提供'},
    info: {type:String, default:'暫未提供'},
    address:{type:String, default:'暫未提供'},
    email:{type:String, default:'暫未提供'},
    currentExhibit: {type:String, default:'未參展'},
    boothNo:{type:String, default:'暫未提供'},
    postAuth:{type:Number, default:0},
    imgURL:{type:String, default:'暫未提供'},
    visitorTime:[Date],
    queue: {type: Schema.Types.ObjectId, ref: 'Queue'},
    post:[{type:Schema.Types.ObjectId, ref:'Message', default:null}],
    history:[{type:Schema.Types.ObjectId, ref:'History', default:null}],
    
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

//0723，利用Email(登入帳號)查找展位
storeSchema.query.byEmail = function(email)  {
    return this.where({email: email});
};

//0723，利用Password(登入密碼)查找展位
storeSchema.query.byPassword = function(password)  {
    return this.where({password: password});
};

//0729，利用req.decoded.boothId做登入後的各種api
storeSchema.query.byBoothId = function(boothId)  {
    return this.where({_id: boothId});
};

//0729，利用req.decoded.boothId以及密碼去更換信箱
storeSchema.query.byIdPsw = function(boothId, password)  {
    return this.where({_id: boothId, password: password});
};

//0729，利用req.decoded.boothId去查找展位
storeSchema.query.byId = function(boothId)  {
    return this.where({_id: boothId});
};

//0801，利用queue去查找排隊資訊
storeSchema.query.byQueue = function(queue)  {
    return this.where({queue: queue});
};

module.exports = mongoose.model('Store',storeSchema);
