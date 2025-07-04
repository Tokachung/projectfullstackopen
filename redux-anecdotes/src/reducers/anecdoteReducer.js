import { createSlice } from '@reduxjs/toolkit'

const generateId = () => (100000 * Math.random()).toFixed(0)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      state.push(action.payload)
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
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { createAnecdote, voteForAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer