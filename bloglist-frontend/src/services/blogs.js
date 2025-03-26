import axios from 'axios'
const baseUrl = 'http://localhost:3002/api/blogs'

// Private variable to store JWT token for authentication
let token = null

// Function to update the token for making authenticated requests
const setToken = newToken => {
  token = `Bearer ${newToken}`
  console.log('the token to update was', token)
}

const getAll = () => {
  const config = {headers: {Authorization: token}}
  
  const request = axios.get(baseUrl, config)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {headers: {Authorization: token}}

  const response = await axios.post(baseUrl, newObject, config) // now also pass config through
  return response.data
}

const update = (id, newObject) => {
  const config = {headers: {Authorization: token}}
  
  const request = axios.put(`${baseUrl}/${id}`, newObject, config)
  console.log('axios request is', request)
  return request.then(response => response.data)
}

export default { 
  getAll, create, update, setToken
}