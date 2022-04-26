var express = require('express');
var path = require('path')
var fs = require('fs')
var Podcast = require('../models/Podcast');
var multer = require('multer');
const { nextTick } = require('process');
var router = express.Router();


var storage = multer.diskStorage({
    destination:(req,file,cb)=>{
      cb(null,'./public/images')
    },
    filename:(req,file,cb)=>{
      console.log(file);
      cb(null,Date.now()+path.extname(file.originalname))
    }
  })
  
  var upload =multer({storage:storage})

//get podcast
router.post('/',upload.single("image"),(req,res,next)=>{
    console.log(req.file)
    Podcast.create(req.body,(err,podcast)=>{
        if(err) return next(err)
        res.send('done')
    })
});

//form
router.get("/new",(req,res)=>{
    res.render("addPodcast")
});


module.exports=router;