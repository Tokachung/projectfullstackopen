import { useSelector, useDispatch } from 'react-redux'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import filterReducer, { filterChange } from './reducers/filterReducer'
import Notification from './components/Notification'

const App = () => {

  const dispatch = useDispatch()

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