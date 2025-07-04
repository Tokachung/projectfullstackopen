import ReactDOM from 'react-dom/client'

import { Provider } from 'react-redux'
import App from './App'
import filterReducer from './reducers/filterReducer'
import notificationReducer from './reducers/notificationReducer'

import { configureStore } from '@reduxjs/toolkit'

import anecdoteService from './services/anecdotes'
import anecdoteReducer, { setAnecdotes } from './reducers/anecdoteReducer'


const store = configureStore({
  reducer: { 
    anecdotes: anecdoteReducer,
    filter: filterReducer,
    notification: notificationReducer,
  }
})

anecdoteService.getAll().then(anecdotes => 
  store.dispatch(setAnecdotes(anecdotes))
)

console.log(store.getState())

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <Provider store={store}>
    <App />
  </Provider>
)
