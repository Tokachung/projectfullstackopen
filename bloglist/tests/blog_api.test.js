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

test.only('blog without title is not added', async () => {

  const blogsAtStart = await helper.blogsInDb()

  const newBlog = {
    url: 'https://ayechanzaw.com/gpt-4o',
  }

  await api.post('/api/blogs').send(newBlog).expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)
})

after(async () => {
  await mongoose.connection.close()
})