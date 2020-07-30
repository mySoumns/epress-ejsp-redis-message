// 用户数据中间，每次访问必须的
const User = require('../models/user');
module.exports = (req,res,next)=>{
    // 获取会话中的uid
    // console.log(req.session)
    const uid = req.session.uid;
    if(!uid) return next();
    User.get(uid,(err,user)=>{
        if(err) return next(err);
        req.user = res.locals.user = user;
        next();
    })
}