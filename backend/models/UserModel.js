const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    username : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    type : {
        type : String,
        default: "user"
    },
    email : {
        type : String,
        default : ""
    },
    quizzes : {
        type: [{
            quizId: { type: mongoose.ObjectId, ref: 'quiz' },
            title: {type: String, required: true},
            startTime: { type: Date, default: 0 },
            stopTime: { type: Date, default: 0 },
            answered: { type: [mongoose.ObjectId], default: [] },
            grade: { type: Number, default: 0 },
            maxGrade: {type: Number, default: 100},
            level: {
                type: String,
                enum: ['beginner','intermediate','advanced'],
                required: true
            },
            passed: {type: Boolean, default: false},
            status: {
                type: String,
                enum: ["schedualed","inprogress","finished"],
                required: true
            }
        }],
        default: []
    }
}, {timestamps : true})

module.exports = mongoose.model('user', userSchema)
