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
    quizes : {
        type: [{
            quizId: { type: mongoose.ObjectId, ref: 'quiz' },
            startTime: { type: Date, default: 0 },
            stopTime: { type: Date, default: 0 },
            answered: { type: [mongoose.ObjectId], default: [] },
            grade: { type: Number, default: 0 },
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
