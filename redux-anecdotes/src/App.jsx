import { useSelector, useDispatch } from 'react-redux'
import { createStore } from 'redux'
import reducer from './reducers/anecdoteReducer'

const store = createStore(reducer)
const generateId = () => {
  return Number((Math.random() * 1000000).toFixed(0))
}

const App = () => {

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    store.dispatch({
      type: 'NEW_ANECDOTE',
      payload: {
        content,
        id: generateId(),
        votes: 0
      }
    })
  }

  const anecdotes = useSelector(state => state)
  const dispatch = useDispatch()
  

  // Once reducer has been properly implemented, dispatch actions

  const vote = (id) => {
    console.log('vote', id)
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div><input name="anecdote" /></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default App