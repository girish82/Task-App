const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req,res,next)=>{
    try{

        res.header("Access-Control-Allow-Origin","*");
        // res.header("Access-Control-Allow-Methods", "POST, GET, PATCH, DELETE");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')
        res.header("Access-Control-Allow-Header","Origin, X-Requested-With, Content-Type, Accept");

        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findOne({_id : decoded._id,'tokens.token':token})
    
        if(!user){
            throw new Error()
        }


        req.token = token
        req.user = user
        next()

    }catch(e){
        res.status(401).send({Error :' Please authenicate'})
    }
}

const postMiddle = async (req,res,next)=>{
    try{

        res.header("Access-Control-Allow-Origin","*");
        // res.header("Access-Control-Allow-Methods", "POST, GET, PATCH, DELETE");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')
        res.header("Access-Control-Allow-Header","Origin, X-Requested-With, Content-Type, Accept");
        next()

    }catch(e){
         res.status(401).send({Error :' Please authenicate'})
    }
}


module.exports = {
    auth,
     postMiddle
}