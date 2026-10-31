const router  = require('express').Router()
const protect = require('../middleware/auth.middleware')
const User    = require('../models/User')

router.use(protect)

// GET /api/users/me
router.get('/me', (req, res) => {
  res.json(req.user)
})

// GET /api/users/search?email=xxx
router.get('/search', async (req, res) => {
  try {
    const users = await User.find({
      email: { $regex: req.query.email, $options: 'i' }
    }).select('name email avatar').limit(5)
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
