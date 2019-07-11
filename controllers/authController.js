const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user');
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
        var token = jwt.sign({adminId:admin._id},config.jwtSalt,{expiresIn:60*60*24*30});
        res.json({status:200,token:token});
        
        return;
    })
}
const checkToken = (req,res,next)=>{
    var token = req.headers['x-access-token'];
    console.log('!')
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
const checkAuth = async (req,res,next) => {
    var token = req.query.token;
    if(token){
        jwt.verify(token,config.jwtSalt, async (err,decoded) => {
            if(err){
                res.json(err,null,res);
                return;
            }else{
                await User.update().updateAuth(decoded.email);
                res.json({status:200,msg:'Success checkAuth'})
            }
        });
        
    }else{
        res.json({status:400,msg:'Fail checkAuth'});
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
    checkAuth,
    checkTokenForAdmin
}