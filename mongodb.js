const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;

const connectionURL = 'mongodb://127.0.0.1/27017';
const database = 'task-manager'
const ObjectID = mongodb.ObjectID;

MongoClient.connect(connectionURL,{useNewUrlParser:true},(error,client)=>{
    if(error){
        return console.log('Unable to Connect')
    }

    console.log('Connected Successfully')
    const db = client.db(database)

    // db.collection('tasks').insertMany([
    //     {
    //         description : 'Clean the room',
    //         status : 'Complete'
    //     },
    //     {
    //         description : 'Cook food',
    //         status : 'Incomplete'
    //     },
    //     {
    //         description : 'Do the work',
    //         status : 'Complete'
    //     }
    // ],(error,result)=> {
    //     console.log(result.ops)
    // })   

    // db.collection('tasks').findOne({status:'Complete'},(error,tasks)=>{
    //     console.log(tasks)
    // })

    // db.collection('tasks').find({status:'Complete'}).toArray((error,tasks)=>{
    //     console.log(tasks)
    // })

    db.collection('tasks').updateOne({_id : new ObjectID("5e846cb7a78c5283d9c2ef13")},{
        $set:{
            description :'Cook food done 2',
            status:'Complete'
        }
    }).then((res)=> console.log(res.modifiedCount))
    .catch((error) => console.log(error))
    
})

