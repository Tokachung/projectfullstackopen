
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

require('dotenv').config()

const app = express()

const PORT = process.env.PORT || 3000
const HOST = '0.0.0.0'

// Middleware to capture JSON response
morgan.token('body', function getBody(req) {
  return JSON.stringify(req.body)
})

app.use(express.json())
app.use(cors()) // Enable CORS
app.use(express.static('dist'))
app.use(morgan(':method :status :url - :response-time ms :body '))

const updatePerson = async (person, res, next) => {
  try {
    const updatedPerson = await Person.findOneAndUpdate({ name: person.name }, { number: person.number }, { new: true })
    res.json(updatedPerson)
  } catch (error) {
    console.log('failed during the update')
    next(error)
  }
}
const savePerson = async (person, res, next) => {
  try {
    const savedPerson = await person.save()
    res.json(savedPerson)
  } catch (error) {
    console.log('failed during the save')
    next(error)
  }
}

// Make a post request to the /api/persons route
app.post('/api/persons', async (req, res, next) => {
  const body = req.body

  if (body.name === undefined) {
    return res.status(400).json({
      error: 'name is missing'
    })
  }
  const person = new Person({
    name: body.name,
    number: body.number
  })

  try {
    const existingPerson = await Person.exists({ name: person.name })
    if (existingPerson) {
      await updatePerson(person, res, next)
    } else {
      await savePerson(person, res, next)
    }
  } catch (error) {
    next(error)
  }
})

// The code below defines two routes for the app. Thie first one defines an event handler to handle HTTP GET request made to the root.
// The second one defines an event handler to handle HTTP GET request made to the /api/persons route.

// When we call the get method, we pass two parameters to it. The first parameter is the route, and the second parameter is the event handler function.
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

// The colon syntax means that we will handle all requests that match the route /api/persons/:id
app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(person => {
    res.json(person)
  })
})

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndDelete(req.params.id).then(() => {
    res.status(204).end()
    console.log('Deleted')
  })
    .catch(error => next(error))
})

app.listen(PORT, HOST, () => {
  console.log(`Server running on port ${PORT}`)
}) // This is a different listen from the one in http. This is an express method

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}

app.use(errorHandler)
