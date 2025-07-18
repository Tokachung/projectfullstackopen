import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    // voteForAnecdote(state, action) {
    //   const id = action.payload.id
    //   const anecdoteToChange = state.find(a => a.id === id)

    //   console.log('anecdoteToChange', anecdoteToChange)
    //   if (!anecdoteToChange) {
    //     console.error(`Anecdote with id ${id} not found`)
    //     return state
    //   }
      
    //   const changedAnecdote = {
    //     ...anecdoteToChange,
    //     votes: anecdoteToChange.votes + 1
    //   }

    //   console.log(state, id, anecdoteToChange, changedAnecdote)

    //   return state.map(anecdote =>
    //     anecdote.id !== id ? anecdote : changedAnecdote
    //   )
    // },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
    updateAnecdote(state, action) {
      const updatedAnecdote = action.payload
      return state.map(anecdote => 
        anecdote.id !== updatedAnecdote.id ? anecdote : updatedAnecdote
      )
    }
  }
})

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteForAnecdote = (anecdote) => {
  const votedAnecdote = {
    ...anecdote,
    votes: anecdote.votes + 1
  }
  return async dispatch => {
    console.log('Voting for anecdote:', anecdote)
    console.log('Sending to API:', votedAnecdote)

    const anecdoteToChange = await anecdoteService.update(anecdote.id, votedAnecdote)
    console.log('Changed anecdote was', anecdoteToChange)
    dispatch(updateAnecdote(anecdoteToChange))
  }
}

export const { updateAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer