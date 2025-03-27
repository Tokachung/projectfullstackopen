import axios from 'axios'
const baseUrl = '/api/blogs'

// Private variable to store JWT token for authentication
let token = null

// Function to update the token for making authenticated requests
const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAllBlogs = async () => {
  const config = {headers: {Authorization: token}}
  const response = await axios.get(baseUrl, config)
  return response.data
}

const createBlog = async newObject => {
  const config = {headers: {Authorization: token}}
  const response = await axios.post(baseUrl, newObject, config) // now also pass config through
  return response.data
}

const updateBlog = async (id, newObject) => {
  const config = {headers: {Authorization: token}}
  const response = await axios.put(`${baseUrl}/${id}`, newObject, config)
  console.log('response data', response.data)
  return response.data
}

const deleteBlog = async (id) => {
  const config = {headers: {Authorization: token}}
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { 
  getAllBlogs, createBlog, updateBlog, deleteBlog, setToken
}