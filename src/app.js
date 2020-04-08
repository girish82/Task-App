const express = require('express')
const app = express()
const User = require('../src/models/user')
const Task = require('../src/models/task')
const userRouter = require('../src/routers/user')
const taskRouter = require('../src/routers/task')
require('../src/db/mongoose')


// app.use(cors())

app.use(express.json())

// const PORT = process.env.PORT 
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    // res.header("Access-Control-Allow-Methods", "POST, GET, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')
    res.setHeader("Access-Control-Allow-Header","Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(userRouter)
app.use(taskRouter)

module.exports = app

// app.listen(PORT,()=>{
//     console.log('Server Started' + PORT)
// })