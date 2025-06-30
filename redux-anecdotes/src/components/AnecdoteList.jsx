import { useSelector, useDispatch } from 'react-redux'
import { voteForAnecdote } from '../reducers/anecdoteReducer'
import { notificationChange, removeNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {

    const dispatch = useDispatch()

    const anecdotes = useSelector(state => {
        if (state.filter != undefined && state.filter !== '') {
            return state.anecdotes.filter(anecdote =>
                anecdote.content.includes(state.filter)
            )
        } else {
            return state.anecdotes
        }
    })

    const sortedAnecdotes = [...anecdotes].sort((a, b) => (
        b.votes - a.votes
    ))

    const vote = (anecdote) => {
        dispatch(voteForAnecdote(anecdote))
        dispatch(notificationChange("Anecdote has been voted for"))
        setTimeout(() => {
            dispatch(removeNotification())
        }, 5000)

    }

    return (
        <>
        {sortedAnecdotes.map(anecdote =>
            <div key={anecdote.id}>
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
                <button onClick={() => vote(anecdote)}>vote</button>
            </div>
            </div>
        )}
        </>
    )
}

export default AnecdoteList