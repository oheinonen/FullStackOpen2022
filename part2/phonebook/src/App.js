import personService from './services/persons'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'
import ErrorNotification from './components/ErrorNotification'
import { useState, useEffect } from 'react'


const Filter = ({persons, namesToShow,filt, setNewFilt}) => {

  const handleFiltChange = (event) => {
      setNewFilt(event.target.value)
    }
    return(
      <form>
      filter shown with <input value={filt} onChange={handleFiltChange} />           
      </form>
    )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [filt, setNewFilt] = useState('')
  const [notification,setNotification] = useState(null)
  const [errorNotification,setErrorNotification] = useState(null)

  const namesToShow = filt.length
    ? persons.filter(person => person.name.toLowerCase().includes(filt.toLowerCase()))
    : persons
  
  useEffect(() => {
    personService
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    })
    },[])


  return (
    <div>
      <h1>Phonebook</h1>

      <Notification message={notification} />
      <ErrorNotification message={errorNotification} />
      <Filter persons={persons} 
              filt={filt} 
              setNewFilt={setNewFilt} 
              namesToShow={namesToShow} />
      <h3> add a new </h3>
      <PersonForm persons={persons} 
                  setPersons={setPersons} 
                  notification={notification}
                  setNotification={setNotification}
                  errorNotification={errorNotification}
                  setErrorNotification={setErrorNotification}/>  
      <h2>Numbers</h2>
      <Persons namesToShow={namesToShow}
                persons={persons} 
                setPersons={setPersons}
                notification={notification}
                setNotification={setNotification}
                errorNotification={errorNotification}
                setErrorNotification={setErrorNotification}/>
  </div>
  )

}

export default App
