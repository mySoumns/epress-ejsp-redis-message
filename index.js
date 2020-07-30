const User = require('./models/user')

console.log('测试')
// const user = new User({name:'test',pass:'test'});
// user.save((err)=>{
//     if(err) console.error(err);
//     console.log('user id %d',user.id)
// });
User.getByName('qiu',(err,user)=>{
    console.log(user)
})