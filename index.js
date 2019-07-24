const express = require('express');
const config = require('./config');
const app = express();
const mongoose = require('mongoose');
const router = require('./routes');
const bodyParser = require('body-parser');
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Methods","POST, PUT, GET, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, x-access-token, Accept");
    next()
})

app.use(bodyParser.json()); //允許json格式
app.use(bodyParser.urlencoded({extended:false})); //允許x-www.form.urlencoded格式
app.use('/leadline',router);

//利用mongoose.connect連接到資料庫
mongoose.connect(config.mongodb,{useNewUrlParser: true}).then(()=>{
    app.listen(config.port, ()=>{
        console.log("listening " + config.port);
    })
})
