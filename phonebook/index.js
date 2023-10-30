const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

morgan.token('body', (request) => JSON.stringify(request.body))
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('build'))
app.use(cors())

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const date = new Date()
  res.send(
    `<p>Phonebook has info for ${persons.length} persons</p>
    <br>
    <p>${date}</p>`
  )
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(persons => persons.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.filter(persons => persons.id !== id)

  res.status(204).end()
})

const generateId = () => {
  const randomID = Math.floor(Math.random () * 500)
  return randomID
}

const postMorgan = morgan(':method :url :status :res[content-length] - :response-time ms :body')

app.post('/api/persons', postMorgan, (req, res) => {
  const body = req.body
  const personsNames = persons.map(persons => personsNames.name)

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number is missing'
    })
  } else if (personsNames.includes(body.name)){
    return res.status(400).json({
      error: 'name must be unique'
    })
  } else {
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number
    }
    persons = persons.concat(person)

    response.json(persons)
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
