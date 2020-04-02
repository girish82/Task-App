const express = require('express')
const app = express()
const User = require('../src/models/user')
const Task = require('../src/models/task')
const userRouter = require('../src/routers/user')
const taskRouter = require('../src/routers/task')
require('../src/db/mongoose')

app.use(express.json())

const PORT = process.env.PORT || 3000

app.use(userRouter)
app.use(taskRouter)

app.listen(PORT,()=>{
    console.log('Server Started')
})