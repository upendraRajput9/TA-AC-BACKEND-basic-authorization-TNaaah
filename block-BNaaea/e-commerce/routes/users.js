var express = require('express')
var User = require('../models/User')
var router = express.Router()

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log(req.session)
  res.render('mainPage')
})

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.clearCookie('connect.sid')
  res.redirect('/users/login')
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/register', (req, res) => {
  res.render('registerForm')
})

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) return next(err)
    res.redirect('/users/login')
  })
})

//cart
router.get('/:userId', (req, res, next) => {
  var userId = req.params.userId
  User.findById(userId)
    .populate('cart')
    .exec((err, user) => {
      if (err) return next(err)

      res.render('cart', { user: user })
    })
})

router.get('/:productId/:userId', (req, res, next) => {
  var userId = req.params.userId
  var productId = req.params.productId
  User.findByIdAndUpdate(
    userId,
    { $push: { cart: productId } },
    (err, user) => {
      if (err) return next(err)
      res.redirect('/products')
    },
  )
})

router.get('/:productId/:userId/remove', (req, res, next) => {
  var userId = req.params.userId
  var productId = req.params.productId

  User.findByIdAndUpdate(
    userId,
    { $pull: { cart: productId } },
    (err, user) => {
      console.log(err, user)
      if (err) return next(err)
      return res.redirect('/users/' + userId)
    },
  )
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
        
        if (user.isAdmin) {
          req.session.userId = user.id
          res.redirect('/products/admin')
        } else {
          req.session.userId = user.id
          res.redirect('/products/')
        }
      }
    })
  })
})

//admin

module.exports = router
