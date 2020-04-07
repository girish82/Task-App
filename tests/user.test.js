const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');

const userOneId = new mongoose.Types.ObjectId()

const userOne = {
    _id:userOneId,
    "name":"Aman P G",
    "age":"6",
    "email":"amang@gmail.com",
    "password":"gargigi",
    "tokens":[{
                token: jwt.sign({_id:userOneId},process.env.JWT_SECRET)
                }]
}

beforeEach(async()=>{
    await User.deleteMany()
    await new User(userOne).save()
})

test('Should sign up a new user',async () =>{

    const response = await request(app).post('/users').send(
        {
            "name":"Gargikk",
            "age":"6",
            "email":"aman21kkkkkk@gmail.com",
            "password":"gargigi"
        }
    ).expect(201)

    const user = await User.findOne({email:'aman21kkkkkk@gmail.com'})

    expect(user.password).not.toBe('gargigi')
})

test('Should login existing user',async () =>{

    await request(app).post('/users/login').send(
        {
            email:userOne.email,
            password:userOne.password
        }
    ).expect(200)
})

test('Should not login non-existing user',async () =>{

    await request(app).post('/users/login').send(
        {
            email:'llllll',
            password:'llllll'
        }
    ).expect(400)
})

test('Should get profile for user',async () =>{
    await request(app).get('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for user',async () =>{
    await request(app).get('/users/me')
    .send()
    .expect(401)
})

test('Should delete profile for user',async () =>{
   await request(app).delete('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete profile for user',async () =>{
    await request(app).delete('/users/me')
    .send()
    .expect(401)
})