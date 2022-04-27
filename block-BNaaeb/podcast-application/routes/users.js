var express = require('express')
var User = require('../models/User')
var router = express.Router()

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('main')
})

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.clearCookie('connect.sid')
  res.redirect('/users/login')
})

router.get(  '/login', (req, res) => {
  res.render('login')
})

router.get('/register', (req, res) => {
  res.render('registerForm')
})

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) return next(err)
    req.session.userId = user.id
          res.redirect('/podcasts/')
  })
})



//login
router.post('/login', (req, res, next) => {
  var { email, password } = req.body
  if (!email || !password) {
    return res.redirect('/users/login')
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err)
    if (!user) {
      return res.redirect('/users/login')
    }
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err)
      if (!result) {
        return res.redirect('/users/login')
      } else {
          req.session.userId = user.id
          res.redirect('/podcasts/')
      }
    })
  })
})

//admin

module.exports = router