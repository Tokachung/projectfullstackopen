import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'
const baseUrl = '/api/persons'

const App = () => {
  const addNewPerson = (newPerson) => {
    const personInPersons = persons.find(person => person.name === newPerson.name)
    if (personInPersons){
      // alert(`${newPerson.name} is already added to phonebook`)
      var answer = window.confirm(`${newPerson.name} is already added to phonebook, replace the old number with a new one?`);
      if (answer) {
        personService.update(personInPersons.id, newPerson)
      }
      else {
        return
      }
    }
    else {
      newPerson.id = (persons.length + 1).toString()
      personService.create(newPerson)
        .then(createdPerson => {
          setPersons(persons.concat(createdPerson.data))
        })
        .catch(error => {
          console.error('Error adding person:', error)
        })
    } 
  }

  const deletePerson = (id) => {
    const url = `${baseUrl}/${id}`
    const editedPersons = persons.filter((p => p.id !== id));
    return axios.delete(url).then((response) => {
      setPersons(editedPersons)
      console.log(response)
    })
  }

  const [persons, setPersons] = useState([]) 

  useEffect(() => {
    personService.getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const [nameFilter, setNameFilter] = useState('')

  const filteredPersons = persons.filter(person => person.name.includes(nameFilter))

  const handleNameFilterChange = (event) => {
    setNameFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter nameFilter={nameFilter} handleNameFilterChange={handleNameFilterChange}/>
      <h3>add a new</h3>
      <Form addNewPerson={addNewPerson} >
      </Form>
      <h3>Numbers</h3>
        <Persons setPersons={setPersons} persons={filteredPersons} deletePerson={deletePerson}/>
    </div>
  )
}

const Form = ({addNewPerson}) => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const handleAddNewPerson = (event) => {
    event.preventDefault()

    const newPerson = {
      name: newName,
      number: newNumber
    }
    addNewPerson(newPerson)
  }
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <form onSubmit={handleAddNewPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
    </form>
  )

}

const Persons = ({setPersons, persons, deletePerson}) => {
  return (
    <div>
      {persons.map(person => 
      <div key={person.id}>
        <div key={person.id}>{person.name}</div>
        <button onClick={() => deletePerson(person.id)}>Delete</button>
        </div>
      )}
    </div>
  )
}

// Filter is just responsible for showing an input value, and changing the state of the filter based on user input
// However, the nameFilter is used by the form as well, which is why the parent manages its state
const Filter = ({nameFilter, handleNameFilterChange}) => {

  return (
    <div>
      filter shown with <input value={nameFilter} onChange={handleNameFilterChange}/>
    </div>
  )
}

export default App