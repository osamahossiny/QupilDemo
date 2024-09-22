const express = require('express')

const { editPassword, editEmail, login, logout, signup, restore} = require('../controllers/UserController')

const { requireUser, requireAny } = require('../middleware/requireAuth')


const router = express.Router()

router.post('/login', login)

router.post('/signup', signup)

router.patch('/editEmail', requireUser, editEmail)

router.patch('/editPassword', requireUser, editPassword)

router.post('/logout', requireAny, logout)

router.get('/restore', requireAny, restore)

module.exports = router