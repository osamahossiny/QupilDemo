const mongoose = require('mongoose')

const Schema = mongoose.Schema

const questionSchema = new Schema({
    question : {
        type : String,
        require : true
    },
    number : {
        type: Number,
        required : true
    },
    line : {
        type : String,
        require : true
    },
    segment : {
        type : String,
        require : true
    },
    grade : {
        type : Number,
        require : true
    }
    
},{autoCreate : false})

const quizSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    questions :{
        type : [questionSchema],
        required : true
    },
    passingGrade :{
        type: Number,
        required : true 
    },
    duration : {
        type : Number,
        required : true
    },
    expertiseLevel : {
        type: String,
        enum: ['beginner','intermediate','advanced'],
        required: true
    }
})

module.exports = mongoose.model('quiz', quizSchema)
