const express = require('express')
const app = express()
const User = require('../src/models/user')
const Task = require('../src/models/task')
const userRouter = require('../src/routers/user')
const taskRouter = require('../src/routers/task')
require('../src/db/mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')



app.use(cors())

app.use(express.json())

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));


// const PORT = process.env.PORT 
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin","*");
    // res.header("Access-Control-Allow-Methods", "POST, GET, PATCH, DELETE");
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')
    res.header("Access-Control-Allow-Header","Origin, X-Requested-With, Content-Type, Accept");


    next();
  });

app.use(userRouter)
app.use(taskRouter)

module.exports = app

// app.listen(PORT,()=>{
//     console.log('Server Started' + PORT)
// })