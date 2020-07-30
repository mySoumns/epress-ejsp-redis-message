const express = require('express');
const router = express.Router();
const User = require('../models/user');

// 获取注册视图
router.get('/register', (req, res, next) => {
    res.render('register', { title: 'Register' })
})

// 注册
router.post('/register', (req, res, next) => {
    const data = req.body.user;
    const user = new User({
        name: data.name,
        pass: data.password
    });
    user.save((err, user) => {
        if (err) return next(err);
        console.log(user)
        User.getId(data.name,(err,id)=>{
            if (err) return next(err);
            req.session.uid = id;
            res.redirect('/');
        });
    })
})

module.exports = router;