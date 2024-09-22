const { Error } = require('mongoose');
const userModel = require("../models/UserModel");
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '1d' })
}

const types = ['admin', 'user'];

const register = async (req, res) => {
    const { username, password, type, email } = req.body;
    try {
        const check = await userModel.findOne({ email }, "_id").lean();
        if (check) {
            throw new Error("This user already exists.");
        }
        if (type && !types.includes(type)) {
            throw new Error("Invalid user type.");
        }
        const data = type? { username, password, type, email }
                         : { username, password, email }
        const user = await userModel.create(data);
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: 86400 * 1000 });
        res.status(200).json({username:user.username, type: user.type});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const editPassword = async (req, res) => {
    try {
        const id = req._id;
        const { oldPassword, newPassword } = req.body
        const passwordObj = await userModel.findOne({ _id: id }, 'password -_id').lean()
        const password = JSON.parse(JSON.stringify(passwordObj)).password
        if (oldPassword === password) {
            const updatedTrainee = await userModel.findOneAndUpdate({ _id: id }, { password: newPassword }, { new: true, upsert: true })
            res.status(200).json(updatedTrainee)
        }
        else {
            res.status(400).json({ error: "Wrong Password" })
        }
    }
    catch (err) {
        res.status(400).json({ error: err.message })
    }
}
const editEmail = async (req, res) => {
    try {
        const id = req._id;
        const { email } = req.body
        const updatedUser = await userModel.findOneAndUpdate({ _id: id }, { email }, { new: true, upsert: true })
        res.status(200).json(updatedUser)
    }
    catch (err) {
        res.status(400).json({ error: err.message })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            throw new Error("Must fill email and password")
        }
        const user = await userModel.findOne({ email }).lean()
        if (!user) {
            throw new Error("Invalid email")
        }

        if (user.password === password) {
            const token = createToken(user._id)
            res.cookie('jwt', token, { httpOnly: true, maxAge: 86400 * 1000 });
            res.status(200).json({username:user.username, type: user.type})
        }
        else {
            throw new Error("wrong password")
        }
    }
    catch (err) {
        res.status(401).json({ error: err.message })
    }
}
const temp = (req, res) => {
    try {
        console.log(req._id);
        res.status(200).json({ _id: req._id })
    }
    catch (err) {
        res.status(400).json({ error: err.message })
    }
}
const logout = (req, res) => {
    try {
        res.cookie('jwt', '', { httpOnly: true, maxAge: 86400 });

        res.status(200).json({ message: "loged out successfully" })
    }
    catch (err) {
        res.status(400).json({ error: err.message })
    }
}

const restore = async (req, res) => {
    try {
        const user = await userModel.findById(req._id, 'username type').lean()
        console.log(user);
        
        res.status(200).json({ username: user.username, type: user.type })
    }
    catch (err) {
        res.status(400).json({ error: err.message })
    }
}

const getMyQuizzes = async (req, res) => {
    try {
        
        const user = await userModel.findById(req._id, 'quizzes').lean()
        console.log(user);
        res.status(200).json(user.quizzes)
    }
    catch (err) {
        res.status(400).json({ error: err.message })
    }
}



module.exports = { register, editPassword, editEmail, login, temp, logout, restore, getMyQuizzes };
