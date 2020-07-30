const express = require('express');
const router = express.Router();
const Entry = require("../models/entry");

// 获取留言板表单视图
router.get('/message',(req, res, next) => {
    const user = res.locals.user;
    if(!user)
    {
        res.redirect('/login');
    }
    res.render('messageAdd', { title: 'post' })
});

// 添加信息
router.post('/message',(req, res, next) => {
    const data = req.body.entry;
    const user = res.locals.user;
    const username = user ? user.name : null;

    const entry = new Entry({
        username:username,
        title:data.title,
        body:data.body
    });
    entry.save((err)=>{
        if(err) return next(err);
        res.redirect('/');
    })
});

module.exports = router;