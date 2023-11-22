const express = require('express')
const morgan = require('morgan')
const app = express()


app.use(express.json())
app.use(morgan('tiny'))

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

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person =  persons.find(person => person.id === id)
    if (person) response.json(person)
    else response.status(404).end()
})

app.get('/info', (request, response) => {
    const date = new Date()
    let toPrint = `Phonebook has info for ${persons.length} people<br/>
    ${date}`
    response.send(toPrint)
})

app.delete('/api/persons/:id', (request,response)=>{
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons',(request, response)=>{
    const body = request.body
    console.log(body)
    if(!body.name || !body.number)
        return response.status(400).json({error:'content missing'})
    
    if(persons.find(person => person.name === body.name))
        return response.status(400).json({error:'person already exists'})
    
    const max = 10000
    const min = 1
    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * (max - min) + min)
    }

    console.log(person)
    persons = persons.concat(person)
    response.json(person)
})

const PORT = 3001
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})