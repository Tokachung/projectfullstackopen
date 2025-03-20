const { test, describe, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const assert = require('node:assert')
const Blog = require('../models/blog')
const helper = require('../utils/list_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test.only('blogs are returned as json', async () => {
  await api.get('/api/blogs')
  .expect(200)
  .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('first author is called Michael Chan"', async () => {
  const response = await api.get('/api/blogs')
  const author = response.body.map(e => e.author)
  console.log(author)
  assert(author[0].includes('Michael Chan'))
})

test('a valid blog can be added', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const newBlog = {
    title: 'How to use ChatGPT 4o for defect detection',
    author: 'Aye Chan Zaw',
    url: 'https://ayechanzaw.com/gpt-4o',
  }

  await api.post('/api/blogs').send(newBlog).expect(201).expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  assert(titles.includes('How to use ChatGPT 4o for defect detection'))

})

test('blog without title is not added', async () => {

  const blogsAtStart = await helper.blogsInDb()

  const newBlog = {
    url: 'https://ayechanzaw.com/gpt-4o',
    author: "Aye Chan Zaw"
  }

  await api.post('/api/blogs').send(newBlog).expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)
})

test('blog without url is not added', async () => {

  const blogsAtStart = await helper.blogsInDb()

  const newBlog = {
    title: "How to prompt gpt-4o for defect detection",
    author: "Aye Chan Zaw"
  }

  await api.post('/api/blogs').send(newBlog).expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)
})

test('when blogs are added and then retrieved, we retrieve the id field and not the _id field', async () => {
  const blogsAtStart = await helper.blogsInDb()
  console.log(blogsAtStart)

  blogsAtStart.forEach((blog) => {
    assert.ok(blog.id, 'Blog should have id property')
    assert.equal(blog._id, undefined, 'Blog should not have an _id property') 
  })
})

test('If likes property missing, return value 0', async () => {
  await Blog.deleteMany({})

  const newBlog = {
    url: 'https://ayechanzaw.com/gpt-4o',
    author: "Aye Chan Zaw",
    title: "How to prompt gpt-4o for defect detection"

  }
  await api.post('/api/blogs').send(newBlog).expect(201)

  const blogsAtEnd = await helper.blogsInDb()
  const addedBlog = blogsAtEnd[0]

  assert.equal(addedBlog.likes, 0)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]
  console.log('blog to delete', blogToDelete)

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  const titles = blogsAtEnd.map(r => r.title)

  assert(!titles.includes(blogToDelete.title))
  assert.strictEqual(blogsAtStart.length, blogsAtEnd.length + 1)
})

test.only('a blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const newBlog = {
    title: "How to prompt gpt-4.5 for defect detection",
    author: "Aye Chan Zaw",
    url: 'https://ayechanzaw.com/gpt-4o'
  }
  
  await api.put(`/api/blogs/${blogToUpdate.id}`, newBlog).expect(200)

  const blogsAtEnd = await helper.blogsInDb()

  const titles = blogsAtEnd.map(r => r.title)

  assert(!titles.includes(newBlog.title))
  assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)
})

after(async () => {
  await mongoose.connection.close()
})