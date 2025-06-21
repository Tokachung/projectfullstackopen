import { useSelector, useDispatch } from 'react-redux'

const AnecdoteList = () => {

    const dispatch = useDispatch()

    // const anecdotes = useSelector(state => state.anecdotes)

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