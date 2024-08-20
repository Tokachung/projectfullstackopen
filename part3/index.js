const express = require('express') // Using express instead of http
const app = express() // Creating an express app

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

// The code below defines two routes for the app. Thie first one defines an event handler to handle HTTP GET request made to the root.
// The second one defines an event handler to handle HTTP GET request made to the /api/notes route.

// When we call the get method, we pass two parameters to it. The first parameter is the route, and the second parameter is the event handler function.
// 
app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
    res.json(notes)
})

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
}) // This is a different listen from the one in http. This is an express method

