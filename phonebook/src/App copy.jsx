import { useState } from 'react'

const App = () => {

  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: "", id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 

  // const [filteredPersons, setFilteredPersons] = useState(persons) 

  // useMemo()

  const addNewPerson = (newPerson) => {

    const personInPersons = persons.find(person => person.name === newPerson.name)

    if (personInPersons){
      alert(`${newPerson.name} is already added to phonebook`)
    }
    else {
      newPerson.id = persons.length + 1
      let newPersons = persons.concat(newPerson)
      setPersons(newPersons)
    } 
  }

  const [nameFilter, setNameFilter] = useState('') // This is used by form and filter, which is why app manages this

  let filteredPersons = persons.filter(person => person.name.includes(nameFilter))

  // We use the changing of the name filter which should cause a re-render of form
  // At the moment everytime we change the filter, we use it to update the persons array and filter it.
  // But maybe we don't need to refilter here?
  const handleNameFilterChange = (event) => {
    setNameFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter nameFilter={nameFilter} handleNameFilterChange={handleNameFilterChange}/>
      <h3>add a new</h3>
      <Form addNewPerson={addNewPerson}
      >
      </Form>
      <h3>Numbers</h3>
        <Persons persons={filteredPersons}/>
    </div>
  )
}

// parse in "addNewPerson"
const Form = ({addNewPerson}) => {
  const [newName, setNewName] = useState('enter name')
  const [newNumber, setNewNumber] = useState('')
  

  const handleAddNewPerson = (event) => {
    event.preventDefault()
    
    const person = {
      name: newName,
      number: newNumber,
      // id: String(persons.length + 1)
    }
    addNewPerson(person)
  }
  // States or props const, not refrencing, then can be.
  // Javascript binding?

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  function handleNameChange() {

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

const Persons = ({persons}) => {
  return (
    <>
      {persons.map(person => <div key={person.id}>{person.name}</div>)}
    </>
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