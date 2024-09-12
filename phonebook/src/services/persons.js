import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
  return axios.get(baseUrl)
}

const create = newObject => {
  return axios.post(baseUrl, newObject)
}

const update = (id, newObject) => {
  console.log('id is:', id)
  console.log('new object is', newObject)
  return axios.put(`${baseUrl}/${id}`, newObject)
}

export default { getAll, create, update }