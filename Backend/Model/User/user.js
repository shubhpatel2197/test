const mongoose = require('mongoose')
const validator = require('validator')
// const bycrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
const { Timestamp } = require('mongodb')

const userschema = new mongoose.Schema({
    username:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:3

    },
    avatar:{
        type:String
    }
},{
        timestamps:true
})

const User = mongoose.model('User',userschema)

module.exports = User;