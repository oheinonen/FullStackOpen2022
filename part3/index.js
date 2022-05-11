const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
var morgan = require('morgan')
const Person = require('./models/persons')

morgan.token('data', (req) => JSON.stringify(req.body) )

app.use(express.json())

app.use(express.static('build'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})


app.get('/api/persons/:id', (req, res,next) => {
  Person.findById(req.params.id)
    .then(person => {
      if(person){
        res.json(person)
      }
      else{
        res.status(404).end
      }
    })
    .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.send(
        `<p>Phonebook hasinfo for ${persons.length} people</p><p>${new Date()}</p>`
      )
    })
    .catch((error) => next(error))
})


app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))

})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const person = new Person({
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random(1000000)*1000000),
  })
  person.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res) => {
  const { name, number } = req.body

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
})


const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
