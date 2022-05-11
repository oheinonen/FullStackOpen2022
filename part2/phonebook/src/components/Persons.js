import personService from '../services/persons'

const Persons = ({namesToShow,persons,setPersons,notification, setNotification}) => {

    return (
      <>
      {namesToShow.map(person =>
        <p key={person.id}>{person.name} {person.number}
        <button onClick={() => {
          const name= person.name
          if(window.confirm(`delete ${person.name}?`)){
            personService
            .deletePerson(person.id)
  
            personService
            .getAll()
            .then(initialPersons => {
              setPersons(initialPersons)  
            setNotification(
              `${name} deleted!`
            )
            setTimeout(() => {
              setNotification(null)
            }, 5000)
    
            })              
          }

        }}>delete</button></p>
        )}
      </>
  
    )
  }
  
export default Persons
  