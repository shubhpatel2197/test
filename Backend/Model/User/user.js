const mongoose = require('mongoose')
const validator = require('validator')
const bycrypt = require('bcryptjs')
const Task = require('./task')
const jwt = require('jsonwebtoken')
const { Timestamp } = require('mongodb')

const userschema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }

        },
        trim:true,
        lowercase:true

    },
    password:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if(value.toString().toLowerCase().includes('password'))
                throw new Error("invalid password")
        },
        minlength:3

    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:String
    }
},{
        timestamps:true
})

userschema.virtual('mytasks',{
    ref: 'Task',
    localField:'_id',
    foreignField:'owner'
})

// res send run this every time 
userschema.methods.toJSON = function (){
    const user = this
    const userobject = user.toObject()
    delete userobject.password
    delete userobject.tokens
    delete userobject.avatar
    return userobject
}

userschema.methods.generateauthtoken = async function(){
    const user= this

    const token = jwt.sign({_id:user._id.toString()},'thisis')

    user.tokens = user.tokens.concat({ token })
    user.save()
    return token
}

userschema.statics.findByCredentials = async (email,password) =>{
     const user = await User.findOne({email});

     if(!user){
        throw new Error('unable to login')
     }

     const ismatch = await bycrypt.compare(password,user.password)

     if(!ismatch){
        throw new Error('unable to login')
     }

     return user

}

userschema.pre('save',async function(next){
    const user = this
    
    if(user.isModified('password')){
       
        user.password = await bycrypt.hash(user.password,8)
    }
   
    next()
})

userschema.pre('remove',async function(next){
    
     const user = this

     await Task.deleteMany({owner:user._id})
     
     next()
})


const User = mongoose.model('User',userschema)

module.exports = User;