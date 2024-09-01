const express = require('express') // Using express instead of http
const app = express() // Creating an express app

// Use json parser to access data
app.use(express.json())

let notes = [
    {
      id: "1",
      content: "HTML is easy",
      important: true
    },
    {
      id: "2",
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: "3",
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
]

// Make a function to generate the id for the new note in the post request
const generateId = () => {
  const maxId = notes.length > 0
  ? Math.max(...notes.map(n => Number(n.id))): 0
  return String(maxId + 1) // Return the maximum id + 1 as a string
}

// Make a post request to the /api/notes route
app.post('/api/notes', (req, res) => {

  // Set the content of the note to the content of the request body
  const body = req.body

  if (!body.content) {
    return res.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false, // If the important field is missing, the important field will be set to false
    id: generateId()
  }

  notes = notes.concat(note) // Add the new note to the notes array

  res.json(note) // Send the new note as a response
  console.log(note) // Log the new note to the console
})

// The code below defines two routes for the app. Thie first one defines an event handler to handle HTTP GET request made to the root.
// The second one defines an event handler to handle HTTP GET request made to the /api/notes route.

// When we call the get method, we pass two parameters to it. The first parameter is the route, and the second parameter is the event handler function.
app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
    res.json(notes)
})

// The colon syntax means that we will handle all requests that match the route /api/notes/:id
app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id
  const note = notes.find(note => note.id === id)

  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id
  notes = notes.filter(note => note.id !== id)

  res.status(204).end()
})

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
}) // This is a different listen from the one in http. This is an express method