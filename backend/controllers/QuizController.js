const { Error } = require('mongoose');
const mongoose = require('mongoose')
const quizModel = require("../models/QuizModel");
const userModel = require("../models/UserModel")

const getAllQuizzes = async (req, res) => {
    const quizes = await quizModel.find({},'title duration expertiseLevel _id').lean()
    console.log(quizes);
    
    res.status(200).json(quizes)
}

const getQuiz = async (req, res) => {
    try {
        const quizId  = req.params.quizId
        console.log(req.params, quizId)
        
        const quiz = await quizModel.findOne({_id: quizId}).lean()
        
        if (quiz && quiz._id) {
            res.status(200).json(quiz)
        }
        else {
            res.status(404).json("Quiz not found")
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

const addQuiz = async (req, res) => {
    try {
        const {title, questions, passingGrade, duration, expertiseLevel} = req.body    
        const quiz = await quizModel.create({title, questions, passingGrade, duration, expertiseLevel});
        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json(error);
    }
}

const startQuiz = async (req, res) => {
    try {
        const id = req._id
        const { quizId } = req.body
        console.log(quizId);
        
        const quiz = await quizModel.findById(quizId,'duration _id')
        if (!quiz || !quiz._id) {
            throw new Error("Invalid quiz id")
        }
        const user = await userModel.findById(id)
        // TODO add logic to stop user from starting quiz while one is already started or schedualed
        const startTime = new Date()
        const stopTime = new Date(startTime.getTime() + quiz.duration * 60000);
        user.quizes.push({
            quizId: quizId,
            startTime,
            stopTime,
            grade: 0,
            status: 'inprogress'
        })
        user.save().then(() => {
            res.status(200).json({message: "quiz started"});
        }).catch((error)=>{
            res.status(500).json(error)
        })
    } catch (error) {
        res.status(500).json(error);
    }
}
const asnwerQuestion = async (req, res) => {
    try {
        const id = req._id
        const { quizId, questionId, answer } = req.body
        const user = await userModel.findById(id)

        const quiz = await quizModel.findOne({
            _id: quizId,
            'questions._id': questionId
        }, {
            'questions.$': 1,
            'passingGrade': 1
        });

        if (!quiz || !quiz.questions || quiz.questions.length === 0) {
            throw new Error('Question not found');
        }

        let seg = answer.split(' ')
        seg = seg[0].replace('?','').replace('؟','').replace(':','').replace("'ّ",'').replace(',','').replace('!','').replace('.','').replace('.','').replace('،','');

        if (quiz.questions[0].segment != seg) {
            return res.status(500).json({error: "wrong answer"});
        }

        const grade = quiz.questions[0].grade
        let found = false;        
        for (let i = 0; i < user.quizes.length; i++) {
            
            if (user.quizes[i].quizId.toString() == quizId) {
                if (user.quizes[i].answered.includes(questionId)) {
                    console.log("answered before");
                    
                    return res.status(200).json({message:"correct answer"})
                }
                else {
                    user.quizes[i].answered.push(new mongoose.Types.ObjectId(questionId));
                    user.quizes[i].grade += grade;
                    if (user.quizes[i].grade >= quiz.passingGrade) {
                        user.quizes[i].passed = true;
                    }
                    found = true;
                    break;
                }
            }
        }
        if (!found) {
            throw new Error("You are not inrolled in this course");
        }
        user.save().then(() => {
            res.status(200).json({message: "answer saved"});
        }).catch((error)=>{
            console.log(error);
            res.status(500).json({error:error.message});
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({error:error.message});
    }
}

module.exports = { getAllQuizzes, getQuiz, addQuiz, startQuiz, asnwerQuestion };