const Admin = require('../models/admin');
const User = require('../models/user');
const Store = require('../models/store');

const create =  async (req, res, next)=>{
    //用postman創造管理者
    let leadlineMaster = req.body.leadlineMaster;
    let leadlineMasterPW = req.body.leadlineMasterPW;
    //只有Quiver可以創在管理者
    if(leadlineMaster === 'Quiver' && leadlineMasterPW === 'Quiver'){
        let password = req.body.password;
        let id = new Date().getTime();
        let email = req.body.email;
        let account = req.body.account;
        let company = req.body.company;

        if(password === undefined||
            id === undefined||
            email === undefined||
            account === undefined||
            company === undefined){
            res.json({status:1, msg:'Bad Request'});
            return;
        }
        let admin = new Admin({
            id : id,
            email:email,
            company:company,
            account: account,
            passsword: password
        });
        admin.save().then(() => res.json({status:1, msg: admin}));
    }else{
        res.send("you are not a developer");
    }
    
}
const getAllUsers = async (req,res,next)=>{
    let users = await User.find();
    res.json({status:-1,msg:{users:users}});
}
const test = (req,res)=>{
    res.send('admin test page');
}
const getAllStores = async(req,res)=>{
    let stores = await Store.find();
    res.json({status:-1, msg:{stores:stores}})
}



module.exports = {
    create,
    getAllStores,
    getAllUsers,
    test,
}