const mongoose = require('mongoose');
const validator = require('validator')

const User = mongoose.model('User',{
    name : {
        type :String,
        required:true,
        trim:true,
        validate(value) {
            if(value.length > 10) {
                throw new Error('Name length should be less than 10 charactor')
            }
        }
    },
    age : {
        type:Number,
        required:true,
        validate(value){
            if (value < 0){
                throw new Error('Age should be a positive number')
            }
        }
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Email is not valid')
            }
        }
    },
    password : {
        type:String,
        required:true,
        trim:true,
        minlength:6,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password should not contain word Password')
            }
        }
    }
})

module.exports = User