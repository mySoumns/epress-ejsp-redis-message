var express = require('express');
var router = express.Router();
const Entry = require("../models/entry");

/* GET home page. */
router.get('/', (req,res,next)=>{
  Entry.getRange(0,-1,(err,entries)=>{
      // console.log(entries)
      if(err) return next(err);
      res.render('index',{
          title:'列表',
          entries:entries
      })
  })
});

module.exports = router;
