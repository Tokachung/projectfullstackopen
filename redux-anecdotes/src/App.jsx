import { useSelector, useDispatch } from 'react-redux'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import filterReducer, { filterChange } from './reducers/filterReducer'

const App = () => {

  const dispatch = useDispatch()

  return (
    <div>
      <h2>Anecdotes</h2>
      filter<input onChange={(event) => {
        dispatch(filterChange(event.target.value))
      }}/>
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App