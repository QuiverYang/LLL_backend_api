const jwt = require('jsonwebtoken');
const config = require('../config');
const Admin = require('../models/admin');

const getToken = (req,res)=>{
    let account = req.body.account;
    let password = req.body.password;
    console.log(`account: ${account}`);
    console.log(`password: ${password}`);
    Admin.find((err, users)=>{
        if(err){
            res.send(err);
        }else{
            console.log(users);
        }
    });
    
    Admin.findOne({account:account, password:password},(err,admin)=>{
        if(err){
            res.json({status:400,msg:err});
        }
        if(!admin){
            res.json({status:401,msg:'invalid user'});
            return;
        }
        var token = jwt.sign({adminId:admin._id},config.jwtSalt,{expiresIn:60*60*24});
        res.json({status:200,token:token});
        
        return;
    })
}

const checkToken = (req,res,next)=>{
    var token = req.headers['x-access-token'];
    if(token){
        jwt.verify(token,config.jwtSalt,(err,decoded)=>{
            if(err){
                res.json({status:401,msg:'invalid token'});
                return;
            }else{
                req.decoded = decoded;
                next();
            }
        })
    }else{
        res.json({status:400,msg:'empty token in headers'});
        return;
    }
}
const checkTokenForAdmin = (req,res,next)=>{
    var token = req.headers['x-access-token'];
    if(token){
        jwt.verify(token,config.jwtSalt,(err,decoded)=>{
            if(err){
                res.json({status:401,msg:'invalid token'});
                return;
            }else{
                req.decoded = decoded;
                res.json({status:200,msg:decoded});
            }
        })
    }else{
        res.json({status:400,msg:'empty token in headers'});
        return;
    }
}


module.exports = {
    getToken,
    checkToken,
    checkTokenForAdmin
}