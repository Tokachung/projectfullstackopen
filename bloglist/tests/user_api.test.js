const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('../utils/list_helper')
const assert = require('node:assert')
const { test, describe, beforeEach, after } = require('node:test')
const supertest = require('supertest')
const mongoose = require('mongoose')

const app = require('../app')
const api = supertest(app)

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        // Note that we do the hashing here to simulate the API
        const passwordHash = await bcrypt.hash("password", 10)
        const user = new User({
            username: 'root',
            name: "root user",
            passwordHash: passwordHash
        })

        await user.save()
    })

    test.only('creation succeeds with a new username', async () => {
        
        // Note that the funciton is asynchronous
        const usersAtStart = await helper.usersInDb()

        // Note that for api interactions, we send a normal object
        const newUser = {
            username: "mickey mouse",
            name: "zhelin wang",
            password: "123"
        }

        await api.post('/api/users').send(newUser).expect(201).expect('Content-Type', /application\/json/)

        // Note that the funciton is asynchronous
        const usersAtEnd = await helper.usersInDb()

        console.log('usersAtEnd are: ', usersAtEnd)
        const usernames = usersAtEnd.map(u => u.username)

        assert(usernames.includes(newUser.username))
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    })

    test.only('if username is taken, do not add the new user', async () => {
        
        // Note that the funciton is asynchronous
        const usersAtStart = await helper.usersInDb()

        // Note that for api interactions, we send a normal object
        const newUser = {
            username: "root",
            name: "zhelin wang",
            password: "123"
        }

        const result = await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', /application\/json/)

        // Note that the funciton is asynchronous
        const usersAtEnd = await helper.usersInDb()

        console.log('usersAtEnd are: ', usersAtEnd)
        const usernames = usersAtEnd.map(u => u.username)

        assert(result.body.error.includes('expected `username` to be unique'))
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })


})

// Always remember to close the connection afterwards
after(async () => {
    await mongoose.connection.close();
});