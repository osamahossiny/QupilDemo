const express = require('express')

const { getAllQuizzes, addQuiz, startQuiz, getQuiz, asnwerQuestion } = require('../controllers/QuizController');
const { requireUser, requireAdmin, requireAny } = require('../middleware/requireAuth')


const router = express.Router()

router.get('/getAllQuizzes', requireAny, getAllQuizzes)

router.get('/getQuiz/:quizId', requireAny, getQuiz)

router.post('/addQuiz', requireAdmin, addQuiz)

// change to requireUser
router.post('/startQuiz', requireAny, startQuiz)

router.post('/asnwerQuestion', requireAny, asnwerQuestion)

module.exports = router