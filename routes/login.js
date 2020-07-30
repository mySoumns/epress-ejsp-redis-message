const express = require('express');
const router = express.Router();
const User = require('../models/user');

// 获取登录视图
router.get('/login',(req,res)=>{
    res.render('login',{title:'Login'});
})

// 登录验证
router.post('/login',(req,res,next)=>{
    const data = req.body.user;
    // console.log(data)
    User.authenticate(data.name,data.password,(err,user)=>{
        // 错误传递
        if(err) return next(err);
        // 处理凭证有效用户
        if(user) 
        {
            // 存储认证id
            req.session.uid = user.id;
            // 登录后重定向
            res.redirect('/');
        }
        else
        {
            // res.error('输出错误！');
            // 重定向回登录表单
            res.redirect('back');
        }
    })
});

// 退出登录
router.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err) throw err;
        res.redirect('/');
    })
});

module.exports = router;

