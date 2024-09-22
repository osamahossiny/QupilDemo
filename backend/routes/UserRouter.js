const express = require('express')

const { editPassword, editEmail, login, logout, register, restore, getMyQuizzes} = require('../controllers/UserController')

const { requireUser, requireAny } = require('../middleware/requireAuth')


const router = express.Router()

router.post('/login', login)

router.post('/register', register)

router.patch('/editEmail', requireUser, editEmail)

router.patch('/editPassword', requireUser, editPassword)

router.post('/logout', requireAny, logout)

router.get('/restore', requireAny, restore)

router.get('/getMyQuizzes', requireAny, getMyQuizzes)

module.exports = router