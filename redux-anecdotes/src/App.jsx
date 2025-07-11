import { useSelector, useDispatch } from 'react-redux'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import filterReducer, { filterChange } from './reducers/filterReducer'
import Notification from './components/Notification'
import anecdoteService from './services/anecdotes'
import { setAnecdotes } from './reducers/anecdoteReducer'
import { useEffect } from 'react'

const App = () => {

  const dispatch = useDispatch()
  
  useEffect(() => {
    anecdoteService.getAll().then(anecdotes => {
      dispatch(setAnecdotes(anecdotes))
    })
  }, [])

  return (
    <div>
      <h2>Anecdotes</h2>
      filter<input onChange={(event) => {
        dispatch(filterChange(event.target.value))
      }}/>
      <Notification />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App