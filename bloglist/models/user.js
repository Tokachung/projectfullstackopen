const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: { type: String, required: false },
    passwordHash: {
        type: String,
        required: true
    }, // Map the id of each blog to each user
    blogs: [
        { type: mongoose.Schema.Types.ObjectId ,
            ref: 'Blog'
        }
    ]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordhash
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User