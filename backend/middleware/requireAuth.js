const jwt = require('jsonwebtoken');
const { Error } = require('mongoose');
const userModel = require("../models/UserModel");

const requireAdmin = async (req,res,next) => {
    const {authorization} = req.headers 
    if(!authorization){
        return res.status(401).json({error:"Token required"})
    }
    const token = authorization
    try{
        const {_id} = jwt.verify(token, process.env.SECRET)
        const user = await userModel.findOne({_id}, 'type _id').lean()
        if(user && user.type == 'admin') {
            req._id=_id 
            next()
        }
        else {throw new Error("You do not have access to this resource")}
    }
    catch(err){
        console.log(err)
        res.status(401).json({error : err.message})
    }
}
const requireUser = async (req,res,next) => {

    const {authorization} = req.headers 
    if(!authorization){
        return res.status(401).json({error:"Token required"})
    }
    const token = authorization

    try{
        const {_id} = jwt.verify(token, process.env.SECRET)
        const user = await userModel.findOne({_id}, 'type _id').lean()
        if(user && user.type == 'user') {
            req._id=_id 
            next()
        }
        else {throw new Error("You do not have access to this resource")}
    }
    catch(err){
        console.log(err)
        res.status(401).json({error : err.message})
    }
}

const requireAny = async (req,res,next) => {
    const {authorization} = req.headers 
    if(!authorization){
        return res.status(401).json({error:"Token required"})
    }
    const token = authorization

    try{
        const {_id} = jwt.verify(token, process.env.SECRET)
        const user = await userModel.findOne({_id}, '_id').lean()
        if(user && user._id) {
            req._id=_id 
            next()
        }
        else {throw new Error("You do not have access to this resource")}
    }
    catch(err){
        console.log(err)
        res.status(401).json({error : err.message})
    }
}

module.exports = { requireAdmin, requireUser, requireAny }