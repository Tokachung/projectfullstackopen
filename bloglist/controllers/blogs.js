const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url
  })

  try {
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    next(error);
  }
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

module.exports = blogsRouter