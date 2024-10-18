const mongoose = require('mongoose')

require('dotenv').config()
mongoose.set('strictQuery', false) // By doing this, we can use the $push operator in the update method

const url = process.env.MONGODB_URI

console.log('connecting to', url)

// Because we know connect returns a promise, we can use async/await and then catch the response or the error
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

// Now we want to define the new person schema
const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

// We want to remove the extra fields from the BSON object that is returned, and turn it into a JSON object
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// Export the Note model
module.exports = mongoose.model('Person', personSchema) // Export the Note model