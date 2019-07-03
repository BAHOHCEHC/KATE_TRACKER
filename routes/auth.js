const express = require('express')
const controller = require('../controllers/auth')
const router = express.Router()

// localhost:6666/api/auth/login
router.post('/login', controller.login)

// localhost:6666/api/auth/register
router.post('/register', controller.register)


module.exports = router