const blog = require('../models/blog')
const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const tokenExtractor = (request, response, next) => {
  // Callback function to extract token
  const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
    }
    return null
  }
  request.token = getTokenFrom(request)
  next()
}

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  console.log('decoded token is: ', decodedToken)
  console.log('running user extractor')
  
  if (!decodedToken) {
    console.log('there is no token')
    return response.status(401).json({ error: 'cannot delete with invalid token'})
  }

  const user = await User.findById(decodedToken.id)
  console.log('user object is', user)
  if (!user) {
    return response.status(401).json({ error: 'user does not exist in the database'})
  }

  request.user = user
  console.log('request.user is', user)
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  console.log('error message is: ', error.message) // USe this to see the error message

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid'})
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired'})
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  }
  
  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}