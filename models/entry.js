const redis = require('redis');
// 创建redis模型
const db = redis.createClient();

class Entry {
    constructor(obj){
        // 遍历传入的值，合并到entry中
        for(let key in obj){
            this[key] = obj[key]
        }
    }
    // 将字符串保存到redis中
    save(cb){
        const entryJson = JSON.stringify(this);
        db.lpush('entries',entryJson,(err)=>{
            if(err) return cb(err)
            cb();
        })
    }
    // 获取一部分消息
    static getRange(from,to,cb){
        db.lrange('entries',from,to,(err,items)=>{
            if(err) return cb(err);
            let entries = [];
            items.forEach((item)=>{
                entries.push(JSON.parse(item));
            })
            cb(null,entries)
        })
    }
}

module.exports = Entry;