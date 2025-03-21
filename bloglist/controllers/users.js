const usersRouter = require('express').Router() // Use express to create routes
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
    // Find the users
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1, author: 1})
    response.json(users)
})

usersRouter.post('/', async (request, response, next) => {
    // Take the request given and extract the body
    const { username, name, password } = request.body

    // Validate password length
    if (!password || password.length < 3) {
        return response.status(400).json({ error: "password must be at least 3 characters long"})
    }

    // Validate username length
    if (!username || username.length < 3) {
        return response.status(400).json({ error: "username must be at least 3 characters long"})
    }

    let test_password = await bcrypt.hash(password, 10)
    console.log('test password is: ', test_password)
    // Create a user object using Mongoose Schema
    const user = new User ({
        username: username,
        name: name,
        passwordHash: await bcrypt.hash(password, 10)
    })

    console.log('user is', user)
    
    // Save user into the database and return Mongoose object
    const savedUser = await user.save()

    // Take mongoose object, and cast it to json and update response code
    response.status(201).json(savedUser)
})

module.exports = usersRouter