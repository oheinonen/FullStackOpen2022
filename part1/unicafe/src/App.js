import { useState } from 'react'

const Button = ({handleClick,text}) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const StatisticsLine = ({text,value}) => {
  let symbol = ""
  if (text==="Positive") {
    symbol = "%"
  }
  return (
    <tr>
    <td>
      {text} 
    </td>
    <td>
      {value} {symbol}
    </td> 
  </tr>

  )
}

const Statistics = ({good,neutral, bad}) => {
  const all = good + neutral + bad

  if (all > 0) {
    return(
      <table>
        <tbody>
          <StatisticsLine text="Good" value={good} />
          <StatisticsLine text="Neutral" value={neutral} />
          <StatisticsLine text="Bad" value={bad} />
          <StatisticsLine text="All" value={all} />
          <StatisticsLine text="Average" value={((good - bad) / all).toFixed(1)} />
          <StatisticsLine text="Positive" value={(100*good/all).toFixed(1)} /> 
        </tbody>
      </table>
    )
  }
  else return (<div> No feedback given </div>)
}

const App = () => {

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const incrementGood = () => {
    setGood(good + 1)
  }

  const incrementNeutral = () => {
    setNeutral(neutral + 1)
  }

  const incrementBad = () => {
    setBad(bad + 1)
  }

  return (
    <div>
        <h1> Give feedback </h1>
        <Button handleClick={() => incrementGood()} text="good" />
        <Button handleClick={() => incrementNeutral()} text="neutral" />
        <Button handleClick={() => incrementBad()} text="bad" />
        <h1> Statistics </h1> 
        <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App
