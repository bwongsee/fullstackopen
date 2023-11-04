require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/person')

morgan.token('body', (request) => JSON.stringify(request.body))
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('build'))

//rest get
app.get('/api/persons', (req, res) => {
  Person.find({}).then(result => {
    res.json(result)
  })
})

//rest info page
app.get('/info', (req, res, next) => {
  const date = new Date()
  console.log(date)

  Person.find({}).then(result => {
    res.send(
      `<p> Phonebook has info for ${res.length} people</p>
      <br>
      <p>${date}</p>`
    )
  })
  .catch(error => next(error))
})

//rest get by id
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    if(person) {
      res.json(person)
    }
    else {
      res.status(404).end()
    }
  })
  .catch(error => next(error))
})

//rest delete
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id).then(result => {
    res.status(204).end()
  })
  .catch(error => next(error))
})

//rest put
app.put('api/persons/:id',(req, res, next) => {
  const {name, number} = req.body

  Person.findByIdAndUpdate(req.params.id, {name, number}, {new:true, runValidators: true, context: 'query'})
  .then(updatedPerson => {
    res.json(updatedPerson)
  })
  .catch(error => next(error))
})

//rest post
const postMorgan = morgan(':method :url :status :res[content-length] - :response-time ms :body')

app.post('/api/persons', postMorgan, (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({error: 'name or number missing'})
  } else {
    const person = new Person({
      name: body.name,
      number: body.number
    })

    person.save().then(personToAdd => {
      response.json(personToAdd)
    })
    .catch (error => next(error))
  }
})

//handler of requests with unkown endpoint
const unknownEndpoint = (req, res) => {
  res.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)

//handler of requests with result to errors
const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  
  if (error.name === 'CastError') {
    return res.status(400).send({error: 'malformatted id'})
  }

  next (error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
