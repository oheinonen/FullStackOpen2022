import { useState } from 'react'

const Button = ({handleClick,text}) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
  const n = anecdotes.length
  const [votes,setVotes] = useState(Array(n).fill(0))
  const [selected, setSelected] = useState(0)

  const most_votes = Math.max(...votes);
  const index = votes.indexOf(most_votes);


  const getRandomInt = (max) => {
    return (Math.floor(Math.random() * max))
  }

  const selectNew = () => {
    setSelected(getRandomInt(n))
  }

  const vote = () => {
    const newVotes = [...votes]
    newVotes[selected] += 1
    setVotes(newVotes)
  }

  return (
    <div>
      <h1> Anecdote of the day</h1>
      {anecdotes[selected]} <br></br>
      has {votes[selected]} votes <br></br>
      <Button handleClick={() => vote()} text="vote" />
      <Button handleClick={() => selectNew()} text="next anecdote" /> <br></br>
      <h1> Anecdote with most votes</h1>
      {anecdotes[index]}<br></br>
      has {votes[index]} votes


    </div>
  )
}

export default App
