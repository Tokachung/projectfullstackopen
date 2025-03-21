const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user') // Add user to blogs router
const jwt = require('jsonwebtoken') // Add jwt logic to modify who can modify db


// Create callback function to look at authorizaiton object within request and get token
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  
  const body = request.body
  
  // header, payload, signature makes up jwt, so secret is needed
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    console.log('there is no token')
    return response.status(401).json({ error: 'invalid token'})
  }

  const user = await User.findById(decodedToken.id) // Only users can make posts now, so we expect userId to be provided

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: user.id
  })

  const savedBlog = await blog.save() // Assign to retrieve generated id from mongoose
  user.blogs = user.blogs.concat(savedBlog._id) // Map back to blog as well
  await user.save()
  response.status(201).json(savedBlog)

})

blogsRouter.post('/', async (request, response, next) => {
  
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url
  })

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response, next) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  console.log(request.body)

  const blog = {
    url : body.url,
    author: body.author,
    title: body.title
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
  console.log(response.json)
})

module.exports = blogsRouter