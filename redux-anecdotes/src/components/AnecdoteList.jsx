import { useSelector, useDispatch } from 'react-redux'

const AnecdoteList = () => {

    const dispatch = useDispatch()

    const anecdotes = useSelector(state => state)
    const sortedAnecdotes = [...anecdotes].sort((a, b) => (
        b.votes - a.votes
    ))

    const vote = (id) => {
        console.log('vote', id)
        dispatch({
            type: 'VOTE',
            payload: {
                id: id
            }
        })
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
                <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
            </div>
        )}
        </>
    )
}

export default AnecdoteList