const mongoose = require('mongoose')

const userSchema = new mongoose.userSchema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: { type: String, required: false },
    passwordhash: {
        type: String,
        required: true
    },
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