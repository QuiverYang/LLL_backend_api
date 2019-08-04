const Store = require('../models/store');
const Msgsave = require('../models/msgsave');
const Message = require('../models/message');
const Exhibition = require('../models/exhibition');

//第一次下載app的初始化
const initMsgArr = async(req, res, next) => {
    let booth = await Store.findOne().byBoothId(req.decoded.boothId);
    if(!booth)  {
        res.json({status: 404, serverMsg: '404, not found, find booth by _id failure.', clientMsg: '訊息載入失敗'});
        return;
    }
    let msgArr = await Msgsave.find().byNames(booth.currentExhibit, booth.name);
    res.json({status: 200, booth: booth, msgArr: msgArr, serverMsg: '200, ok, find msgArr success.', clientMsg: '訊息載入成功'});
}

//0730：使用者直接新增推播訊息
const sendAddMsg = async(req, res, next) => {
    let boothId = req.decoded.boothId;
    let booth = await Store.findOne().byBoothId(boothId);
    if(!booth)  {
        res.json({status: 404, serverMsg: '404, not found, find booth by _id failure.', clientMsg: '推播失敗'});
        return;
    }
    if(req.body.title.trim().length == 0 || req.body.content.trim().length == 0)  {
        res.json({status: 404, serverMsg: '400, bad request, field can not blank.', clientMsg: '標題與內容皆不可為空'});
        return;
    }
    let postAuth = req.body.postAuth;
    let exhibition = req.body.exhibition;
    let name = req.body.name;
    let title = req.body.title;
    let content = req.body.content;
    let web = req.body.web;
    let time = req.body.time;
    let msgsave = new Msgsave({
        exhibition: exhibition,
        name: name,
        title: title,
        content: content,
        web: web,
        time: time
    });
    let postTitle = req.body.postTitle;
    let postContent = req.body.postContent;
    let postWeb = req.body.postWeb;
    if(postTitle == 'systemNull')  {
        msgsave.save().then(() => 
        res.json({status: 200, booth: booth, msgsave: msgsave, post: {title: 'systemNull'}, serverMsg: '200, ok, save msg to server success.', clientMsg: '儲存成功'}));
    }else  {
        let post = new Message({
            title: postTitle,
            content: postContent + '\n' + postWeb,
        });  
        msgsave.save().then(post.save().then(() => {
            Store.findOneAndUpdate({_id: boothId}, {$push:{post: post}}, {new: true}, function(err, booth)  {
                if(err || !booth)  {
                    res.json({status: 400, booth: booth, msgsave: msgsave, post: post, serverMsg: '404, not found, find booth by _id failed.', clientMsg: '連線異常，請重新嘗試'});
                    return;
                }
            })
        }));
        Exhibition.findOneAndUpdate({name: booth.currentExhibit}, {$push:{allPosts: post._id}}, {new: true}, function(err, exhibition)  {
            if(err || !exhibition)  {
                res.json({status: 400, booth: booth, msgsave: msgsave, post: post, serverMsg: '404, not found, find booth by _id failed.', clientMsg: '連線異常，請重新嘗試'});
                return;
            }
        });
        Store.findOneAndUpdate({_id: boothId}, {$set:{postAuth: postAuth - 1}}, {new: true}, function(err, booth)  {
            if(err || !booth)  {
                res.json({status: 400, booth: booth, msgsave: msgsave, post: post, serverMsg: '404, not found, find booth by _id failed.', clientMsg: '連線異常，請重新嘗試'});
                return;
            }
        res.json({status: 200, booth: booth, msgsave: msgsave, post: post, serverMsg: '200, ok, send msg to server success.', clientMsg: '推播成功'});
        });
    }
};

//0730：使用者修改推播訊息
const sendReplaceMsg = async(req, res, next) => {
    let boothId = req.decoded.boothId;
    let booth = await Store.findOne().byBoothId(boothId);
    if(!booth)  {
        res.json({status: 404, serverMsg: '404, not found, find booth by _id failure.', clientMsg: '推播失敗'});
        return;
    }
    if(req.body.title.trim().length == 0 || req.body.content.trim().length == 0)  {
        res.json({status: 404, serverMsg: '400, bad request, field can not blank.', clientMsg: '標題與內容皆不可為空'});
        return;
    }
    let postAuth = req.body.postAuth;
    let id = req.body.id;
    let exhibition = req.body.exhibition;
    let name = req.body.name;
    let title = req.body.title;
    let content = req.body.content;
    let web = req.body.web;
    let time = req.body.time;

    let postTitle = req.body.postTitle;
    let postContent = req.body.postContent;
    let postWeb = req.body.postWeb;
    if(postTitle == 'systemNull')  {
        Msgsave.findOneAndUpdate({_id: id}, {$set:{exhibition: exhibition, name: name, title: title, content: content, web: web, time: time}}, {new: true}, function(err, msgsave)  {
            if(err || !msgsave)  {
                res.json({status: 400, booth: booth, msgsave: msgsave, post: {_id: 'noPost'}, serverMsg: '404, not found, find msgsave by _id failed.', clientMsg: '連線異常，請重新嘗試'});
                return;
            }
            res.json({status: 200, booth: booth, msgsave: msgsave, post: {_id: 'noPost'}, serverMsg: '200, ok, save msg to server success.', clientMsg: '儲存成功'});
        });
    }else  {
        let post = new Message({
            title: postTitle,
            content: postContent + '\n' + postWeb,
        }); 
        let msgsave = await Msgsave.findOne().byId(id);
        Msgsave.findOneAndUpdate({_id: id}, {$set:{name: name, title: title, content: content, web: web, time: time}}, {new: true}, function(err, msgsave)  {
            if(err || !msgsave)  {
                res.json({status: 400, booth: booth, msgsave: msgsave, post: post, serverMsg: '404, not found, find msgsave by _id failed.', clientMsg: '連線異常，請重新嘗試'});
                return;
            }
        });
        Exhibition.findOneAndUpdate({name: booth.currentExhibit}, {$push:{allPosts: post._id}}, {new: true}, function(err, exhibition)  {
            if(err || !exhibition)  {
                res.json({status: 400, booth: booth, msgsave: msgsave, post: post, serverMsg: '404, not found, find booth by _id failed.', clientMsg: '連線異常，請重新嘗試'});
                return;
            }
        });
        post.save().then(
            Store.findOneAndUpdate({_id: boothId}, {$push:{post: post}}, {new: true}, function(err, booth)  {
                if(err || !booth)  {
                    res.json({status: 400, booth: booth, msgsave: msgsave, post: post, serverMsg: '404, not found, find booth by _id failed.', clientMsg: '連線異常，請重新嘗試'});
                    return;
                }
            })
        );
        Store.findOneAndUpdate({_id: boothId}, {$set:{postAuth: postAuth - 1}}, {new: true}, function(err, booth)  {
            if(err || !booth)  {
                res.json({status: 400, booth: booth, msgsave: msgsave, post: post, serverMsg: '404, not found, find booth by _id failed.', clientMsg: '連線異常，請重新嘗試'});
                return;
            }
            res.json({status: 200, booth: booth, msgsave: msgsave, post: post, serverMsg: '200, ok, send msg to server success.', clientMsg: '推播成功'});
        })
    }
};

//0730：使用者修改推播訊息
const sendDeleteMsg = async(req, res, next) => {
    let boothId = req.decoded.boothId;
    let booth = await Store.findOne().byBoothId(boothId);
    if(!booth)  {
        res.json({status: 404, serverMsg: '404, not found, find booth by _id failure.', clientMsg: '刪除失敗'});
        return;
    }
    let id = req.body.id;
    Msgsave.deleteOne({_id: id}, function(err, msgsave)  {
        if(err || !msgsave)  {
            res.json({status: 400, booth: booth, serverMsg: '404, not found, find msgsave by _id failed.', clientMsg: '連線異常，請重新嘗試'});
            return;
        }
        res.json({status: 200, serverMsg: '200, ok, delete message success.', clientMsg: '刪除成功'});
    })
}

module.exports = {
    initMsgArr,
    sendAddMsg,  //0730：使用者直接新增推播訊息
    sendReplaceMsg,  //0730：使用者修改推播訊息 
    sendDeleteMsg  //0730：使用者刪除推播訊息
}