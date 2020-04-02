const mongoose = require('mongoose');

const connectionURL = 'mongodb://127.0.0.1:27017/task-manager-api';

mongoose.connect(connectionURL,{
    useNewUrlParser:true,
    useCreateIndex:true
},(err,res)=>{
    console.log(res)
})


// const user = new User({name:'Girish P P',age:38,email:'pgirish@gmail.com',password:'giripp'})

// user.save()
//     .then((res)=> console.log(res))
//     .catch((error)=> console.log('Error ' + error))

// const task = new Task({description:'Cook the food   ',completed:true})
// task.save()
//     .then((res)=> console.log(res))
//     .catch((error)=> console.log('Error ' + error))