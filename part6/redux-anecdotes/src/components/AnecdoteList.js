import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return(
    <div key={anecdote.id}>
    <div>
      {anecdote.content}
    </div>
    <div>
      has {anecdote.votes}
      <button onClick={handleClick}>vote</button>
    </div>
  </div>
  )
}
const AnecdoteList = () => {
  const anecdotes =  useSelector(state => {
  return state.anecdotes
    .filter((a) => a.content.includes(state.filter))
    .sort((a, b) => b.votes- a.votes)
  })
  const dispatch = useDispatch()

  const handlevote = (anecdote) => {
    dispatch(voteAnecdote(anecdote))
    dispatch(setNotification(`voted '${anecdote.content}'`,5 ))
  }

  return(
    <div>
      {anecdotes.map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => handlevote(anecdote)}
        />
      )}
    </div>
  )
}

export default AnecdoteList