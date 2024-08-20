const http = require('http')

// The primary purpose of the backend server is to offer raw data in JSON format to the frontend.
// This is why we get our server to return a hardcoded list of notes in JSON format. 
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

// We create a new server with the createServer function.
// We register an event handler that is called everytme an HTTP request is made to the server
// After the request is made, the response is sent with the response.writeHead and response.end methods.
// We are manually writing a status code of 200 and a content type of text/plain to the response header.
const app = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end(JSON.stringify(notes))
})











const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
