var User = require('../models/User')

module.exports = {
  loggedInUser: function (req, res, next) {
    if (req.session && req.session.userId) {
    next()
    } else {
      res.redirect('/users/login')
    }
  },
  userInfo: function (req, res, next) {
    var userId = req.session && req.session.userId
    console.log(req.locals)
    if (userId) {
      User.findById(userId, 'name email', (err, user) => {
        if (err) return next(err)
        req.user = user
        res.locals.user = user
       return next()
      })
    } else {
      req.user = null
      res.locals.user = null
     return next()
    }
  },
}
