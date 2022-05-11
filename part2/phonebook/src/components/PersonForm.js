import { useState } from 'react'
import personService from '../services/persons'

const PersonForm = ({persons,setPersons, notification, setNotification,errorNotification,setErrorNotification}) => {
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
  
    const addName = (event) =>{
      event.preventDefault()

      const personObject = {
        name: newName, 
        number: newNumber
      }
      if (persons.filter(person => person.name === newName).length){
        if (window.confirm( `${newName} is already added to phonebook, replace the old number with a new one?`)){
          const personId = persons.filter(person => person.name === newName)[0].id
          personService
            .update(personId, personObject)
            .then( newPerson => {
              setPersons(persons.map(person => person.id !== personId ? person : newPerson))
              setNewName('')
              setNewNumber('')
              setNotification(
                `number of ${newName} changed!`
              )
              setTimeout(() => {
                setNotification(null)
              }, 5000)

            })
            .catch(error => {
                setErrorNotification(
                    `information of ${newName} is removed from the server`
                )
                setTimeout(() => {
                    setErrorNotification(null)
                },5000)
            })

            personService
            .getAll()
            .then(initialPersons => {
              setPersons(initialPersons)  
            })

                
          }
        
      }
      else{
        personService
          .create(personObject)
          .then( createdPerson => {

            setPersons(persons.concat(createdPerson))
            setNewName('')
            setNewNumber('')
            setNotification(
              `${newName} added!`
          )
          setTimeout(() => {
              setNotification(null)
          }, 5000)
          })
          .catch(error => {
            setErrorNotification(error.response.data.error)
            setTimeout(() => {
                setErrorNotification(null)
            },5000)
          })
        }
      }

      const handleNameChange = (event) => {
        setNewName(event.target.value)
      }
  
      const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
      }
      return(
        <form onSubmit={addName}>
        <div>
          name: <input 
                  value={newName} 
                  onChange={handleNameChange} 
                />
        </div>
        <div>
          number: <input 
                  value={newNumber} 
                  onChange={handleNumberChange} 
                />
        </div>
  
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      )
  
  }
export default PersonForm