const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('../utils/list_helper')
const assert = require('node:assert')
const { test, describe, beforeEach, after } = require('node:test')
const supertest = require('supertest')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const app = require('../app')
const api = supertest(app)

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        // Create a test user
        const testUser = new User({
            username: 'admin',
            name: 'admin user name',
            passwordHash: await bcrypt.hash('password', 10)
        })
        
        // Save test user into db
        const savedUser = await testUser.save()

        // Generate a JWT token for the test user that we can use in the tests
        const userForToken = {
            username: savedUser.username,
            id: savedUser._id,
            name: savedUser.name
        }

        const token = jwt.sign(
            userForToken,
            process.env.SECRET,
            { expiresIn: 3600 }
        )
        
        validUserToken = token
    })

    test('creation succeeds with a new username', async () => {
        
        // Note that the funciton is asynchronous
        const usersAtStart = await helper.usersInDb()

        // Note that for api interactions, we send a normal object
        const newUser = {
            username: "mickey mouse",
            name: "zhelin wang",
            password: "123"
        }

        await api.post('/api/users').send(newUser).expect(201).expect('Content-Type', /application\/json/).set('Authorization', `Bearer ${validUserToken}`)

        // Note that the funciton is asynchronous
        const usersAtEnd = await helper.usersInDb()
        const usernames = usersAtEnd.map(u => u.username)

        assert(usernames.includes(newUser.username))
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    })

    test.only('if username is taken, do not add the new user', async () => {
        
        // Note that the funciton is asynchronous
        const usersAtStart = await helper.usersInDb()

        // Note that for api interactions, we send a normal object
        const newUser = {
            username: 'test user',
            name: 'test user name',
            password: await bcrypt.hash('testpassword', 10)
        }

        const result = await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', /application\/json/).set('Authorization', `Bearer ${validUserToken}`)

        // Note that the funciton is asynchronous
        const usersAtEnd = await helper.usersInDb()

        assert(result.body.error.includes('expected `username` to be unique'))
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('if username is too short, return error', async () => {
        
        // Note that the funciton is asynchronous
        const usersAtStart = await helper.usersInDb()

        // Note that for api interactions, we send a normal object
        const newUser = {
            username: "ro",
            name: "zhelin wang",
            password: "123"
        }

        const result = await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', /application\/json/).set('Authorization', `Bearer ${validUserToken}`)

        // Note that the funciton is asynchronous
        const usersAtEnd = await helper.usersInDb()

        
        assert(result.body.error.includes('username must be at least 3 characters long'))
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('if password is too short, return error', async () => {
        
        // Note that the funciton is asynchronous
        const usersAtStart = await helper.usersInDb()

        // Note that for api interactions, we send a normal object
        const newUser = {
            username: "test_username",
            name: "zhelin wang",
            password: "12"
        }

        const result = await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', /application\/json/).set('Authorization', `Bearer ${validUserToken}`)

        const usersAtEnd = await helper.usersInDb()
        
        assert(result.body.error.includes('password must be at least 3 characters long'))
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})

// Always remember to close the connection afterwards
after(async () => {
    await mongoose.connection.close();
});