var express = require('express')
var path = require('path')
var fs = require('fs')
var Podcast = require('../models/Podcast');
var multer = require('multer')
const User = require('../models/User')
var router = express.Router()

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

var upload = multer({ storage: storage});


//get form
router.get('/',(req,res,next)=>{
Podcast.find({},(err,podcast)=>{
   if(err) return next(err);
   res.render('podcasts',{list:podcast})
})
})

router.get('/new',(req,res)=>{
    res.render('addPodcast')
})

router.post('/',upload.array('file',2),(req,res,next)=>{
req.body.cover = req.files[0].filename
    req.body.audioTrack = req.files[1].filename
    Podcast.create(req.body,(err,podcast)=>{
        if(err) return next(err);
        res.redirect('/podcasts')
    })
})


module.exports = router