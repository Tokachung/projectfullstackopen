const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  if (request.user == null) {
    response.status(401).json({ message: 'user is not logged in'})
  }
  else {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1})
    response.json(blogs)
  }
})

blogsRouter.post('/', async (request, response, next) => {

  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: request.user._id
  })

  const savedBlog = await blog.save() // Assign to retrieve generated id from mongoose
  request.user.blogs = request.user.blogs.concat(savedBlog._id) // Map back to blog as well
  await request.user.save()
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

  const blog = await Blog.findById(request.params.id)
  
  if (blog.user.toString() === request.user._id.toString()) {
    await Blog.findByIdAndDelete(request.params.id.toString())
  } else {
    return response.status(401).json({ error: 'wrong user, invalid delete operation'})
  }
  
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body;
  
  const blog = {
    url: body.url,
    author: body.author,
    title: body.title,
    likes: body.likes,
  };

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true }).populate('user', { username: 1, name: 1});

    if (!updatedBlog) {
      return response.status(404).json({ error: 'Blog not found' });
    }
    response.json(updatedBlog);
  } catch (error) {
    response.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = blogsRouter