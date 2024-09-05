const express = require('express')
var morgan = require('morgan')

const app = express()

// Middleware to parse JSON bodies
app.use(express.json())

// Middleware to capture JSON response
morgan.token('body', function getBody (req) {
  return JSON.stringify(req.body)
})
// log response to console
app.use(morgan(':method :status :url - :response-time ms :body '))

let persons = [
    {
      "name": "Arto Hellas",
      "number": "12345",
      "id": "1"
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": "2"
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": "3"
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": "4"
    },
    {
      "id": "5",
      "name": "shawn tang",
      "number": "3254234"
    }
]

// Make a function to generate the id for the new person in the post request
const generateId = () => {
    const maxId = persons.length > 0
    ? Math.max(...persons.map(n => Number(n.id))): 0
    return String(maxId + 1) // Return the maximum id + 1 as a string
  }
  
  // Make a post request to the /api/persons route
  app.post('/api/persons', (req, res) => {
  
    // Set the content of the person to the content of the request body
    const body = req.body

    if (!body.content) {
      return res.status(400).json({
        error: 'content missing'
      })
    }
  
    const person = {
      content: body.content,
      important: Boolean(body.important) || false, // If the important field is missing, the important field will be set to false
      id: generateId()
    }
  
    persons = persons.concat(person) // Add the new person to the person array
  
    res.json(person) // Send the new person as a response
    console.log(person) // Log the new person to the console
  })
  
  // The code below defines two routes for the app. Thie first one defines an event handler to handle HTTP GET request made to the root.
  // The second one defines an event handler to handle HTTP GET request made to the /api/persons route.
  
  // When we call the get method, we pass two parameters to it. The first parameter is the route, and the second parameter is the event handler function.
  app.get('/', (req, res) => {
      res.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/persons', (req, res) => {
      res.json(persons)
  })
  
  // The colon syntax means that we will handle all requests that match the route /api/persons/:id
  app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(person => person.id === id)
  
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })
  
  app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    persons = persons.filter(person => person.id !== id)
  
    res.status(204).end()
  })
  
  const PORT = 3001
  
  app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
  }) // This is a different listen from the one in http. This is an express method


