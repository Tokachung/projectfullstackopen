import { createSlice } from '@reduxjs/toolkit'

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const generateId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: generateId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)
console.log('initial state is', initialState)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    createAnecdote(state, action) {
      const content = action.payload
      state.push({
        content,
        id: generateId(),
        votes: 0
      })
    },
    voteForAnecdote(state, action) {
      const id = action.payload.id
      const anecdoteToChange = state.find(a => a.id === id)

      console.log('anecdoteToChange', anecdoteToChange)
      if (!anecdoteToChange) {
        console.error(`Anecdote with id ${id} not found`)
        return state
      }
      
      const changedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1
      }

      console.log(state, id, anecdoteToChange, changedAnecdote)

      return state.map(anecdote =>
        anecdote.id !== id ? anecdote : changedAnecdote
      )
    }
  }
})

export const { createAnecdote, voteForAnecdote } = anecdoteSlice.actions
export default anecdoteSlice.reducer