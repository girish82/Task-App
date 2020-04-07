const express = require("express")
const router = new express.Router();
const {auth,postMiddle} = require('../../src/middleware/auth')
const User = require('../../src/models/user')
const multer = require('multer')
const sharp = require('sharp')
const {sendwelcomeEmail,sendCancelEmail} = require('../emails/account')


router.post('/users',postMiddle, async(req,res) =>{
    const user = new User(req.body)
    try{
        await user.save()
        sendwelcomeEmail(user.email,user.name)
        const token = await user.getAuthToken()
        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/users/me',auth,async(req,res) =>{
    try{
        // const user = await User.find({})
        res.status(200).send(req.user)
    }catch(e){
        res.status(500).send({Error : 'Please authenticate'})
    }
})

router.get('/users/:id',async(req,res) =>{
    const _id = req.params.id;
    try{
        const user = await User.findById(_id)
        if(!user){
            return res.status(500).send()
        }
        res.send(user)
    }catch(e){
        res.status(500).send(e)
    }
})

router.patch('/users/me',auth,async(req,res)=>{
    try{
        const updates = Object.keys(req.body)
        const allow = ['name','age','email','password']
        const isAllowed = updates.every((update)=> allow.includes(update))

        if (!isAllowed){
            return res.status(400).send({error : 'Invalid Updates'})
        }

        // const user = await User.findById(req.params.id)
        updates.forEach(update => req.user[update]=req.body[update]);
        await req.user.save()

       // const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})

        // if(!user){
        //     return res.status(404).send()
        // }

        res.status(200).send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/users/me',auth,async(req,res)=>{
    try{
        // const user = await User.findByIdAndDelete(req.params.id)
        // if(!user){
        //     return res.status(404).send()
        // }
        await req.user.remove()
        sendCancelEmail(req.user.email,req.user.name)
        res.status(200).send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/login',async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.getAuthToken()
        if(!user){
            return res.status(404).send()
        }
        res.status(200).send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.status(200).send()
    }catch(e){
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    }catch(e){
        res.status(500).send(e)
    }
})

const upload = multer({
    // 'dest':'avatar',
    limits : {
        fileSize : 1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload a image file'))
        }
        cb(undefined,true)
    }
})

router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar = buffer
    console.log(req.user)
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({Error : error.message})
})

router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({Error : error.message})
})

router.get('/users/:id/avatar',async(req,res)=>{

    try{
        const user = await User.findById(req.params.id)
        console.log(user)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-type','image/png')
        res.status(200).send(user.avatar)
    }catch(e) {
        res.status(400).send({Error : e.message})
    } 
})

module.exports = router

