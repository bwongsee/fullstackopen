require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/person')

morgan.token('body', (request) => JSON.stringify(request.body))
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('build'))

app.get('/api/persons', (req, res) => {
  Person.find({}).then(result => {
    res.json(result)
  })
})

app.get('/info', (req, res) => {
  const date = new Date()
  console.log(date)
  res.send(
    `<p>Phonebook has info for ${persons.length} persons</p>
    <br>
    <p>${date}</p>`
  )
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.filter(persons => persons.id !== id)

  res.status(204).end()
})

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
  }
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
