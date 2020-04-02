const express = require("express")
const router = new express.Router();
const Task = require('../../src/models/task')

router.post('/tasks',async(req,res) =>{
    const task = new Task(req.body)

    try{
        await task.save()
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
 
})

router.get('/tasks',async(req,res) =>{

    try{
        const task = await Task.find({})
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }

})

router.get('/tasks/:id',async(req,res) =>{
    const _id = req.params.id;

    try{
        const task = await Task.findById(_id)
        if(!task){
            return res.status(500).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id',async(req,res)=>{
    try{
       const updates = Object.keys(req.body)
        const allow = ['description','completed']
        const isAllowed = updates.every((update)=> allow.includes(update))

        if (!isAllowed){
            return res.status(400).send({error : 'Invalid Updates'})
        }
        const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})

        if(!task){
            return res.status(404).send()
        }
        res.status(200).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id',async(req,res)=>{
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task){
            return res.status(404).send()
        }
        res.status(200).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

module.exports = router