// 用户模型
const redis = require('redis');
// 使用bcryptjs代替了漏洞百出的bcrypt
const bcrypt = require('bcryptjs');
// 创建长链接
const db = redis.createClient();

class User {
    constructor(obj){
        // 遍历obj
        for(let key in obj){
            // 合并到this里
            this[key] = obj[key]
        }
    }
    // 创建
    save(cb){
        if(this.id)
        { // id存在，则更新
            this.update(cb);
        }
        else 
        {
            db.incr('user:ids',(err,id)=>{
                if(err) return cb(err);
                this.id = id;
                this.hashPassword((err)=>{
                    if(err) return cb(err);
                    this.update(cb);
                })
            })
        }
    }
    // 更新
    update(cb){
        const id = this.id;
        db.set(`user:id:${this.name}`,id,(err)=>{
            if(err) return cb(err);
            db.hmset(`user:${id}`,this,(err)=>{
                cb(err);
            })
        })
    }
    //加盐的哈希
    hashPassword(cb){
        // 生成12字符的盐
        bcrypt.genSalt(12,(err,salt)=>{
            if(err) return cb(err);
            // 设定盐
            this.salt = salt;
            // 对密钥和盐进行哈希处理
            bcrypt.hash(this.pass,salt,(err,hash)=>{
                if(err) return cb(err);
                this.pass = hash;
                cb();
            })
        })
    }

    // 通过name获取用户
    static getByName(name,cb){
        User.getId(name,(err,id)=>{
            if(err) return cb(err);
            User.get(id,cb);
        })
    }

    // 获取用户id
    static getId(name,cb){
        db.get(`user:id:${name}`,cb);
    }

    // 获取用户信息
    static get(id,cb){
        db.hgetall(`user:${id}`,(err,user)=>{
            if(err) return cb(err);
            cb(null,new User(user));
        })
    }

    // 用户认证
    static authenticate(name,pass,cb){
        // 通过用户名查找
        User.getByName(name,(err,user)=>{
            if(err) return cb(err);
            // 用户不存在
            if(!user.id) return cb();
            // 做密码做哈希处理
            bcrypt.hash(pass,user.salt,(err,hash)=>{
                if(err) return cb(err);
                // 匹配密码
                if(hash == user.pass) return cb(null,user);
                // 密码无效
                cb();
            })
        })
    }
}
module.exports = User;