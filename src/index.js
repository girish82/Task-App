const express = require('express')
const app = express()
const User = require('../src/models/user')
const Task = require('../src/models/task')
const userRouter = require('../src/routers/user')
const taskRouter = require('../src/routers/task')
require('../src/db/mongoose')

// app.use((req,res,next)=>{
//     if(req.method === 'GET') {
//         res.send('GET requests not allowed')
//     }else{
//         next();
//     }   
// })

app.use(express.json())

const PORT = process.env.PORT 

app.use(userRouter)
app.use(taskRouter)

app.listen(PORT,()=>{
    console.log('Server Started' + PORT)
})