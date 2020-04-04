const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')


const userSchema = new mongoose.Schema({
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
        unique:true,
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
    },
    tokens : [{
        token : {
            type : String,
            required: true
        }
    }],
    avatar : {
        type:Buffer

    }

},
{
    timestamps:true
})

userSchema.virtual('tasks',{
    ref : 'Task',
    localField : '_id',
    foreignField : 'owner'
})

userSchema.methods.getAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},'thisismynewcourse')

     user.tokens = user.tokens.concat({token})

    await user.save()
    return token

}

userSchema.methods.toJSON = function() {
    const user = this
    const userObj = user.toObject();

    delete userObj.password
    delete userObj.tokens
    delete userObj.avatar

    return userObj
}

userSchema.statics.findByCredentials = async function(email,password){
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}

userSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password')) {
        user.password =  await bcrypt.hash(user.password,8)
    }

    console.log('saving')

    next();
    
})

userSchema.pre('remove',async function(next){
    const user = this

    await Task.deleteMany({'owner':user._id})
    next()
})

const User = mongoose.model('User',userSchema)

module.exports = User