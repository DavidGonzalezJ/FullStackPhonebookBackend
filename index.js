require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()
const cors = require('cors')


app.use(express.json())
app.use(cors())
app.use(express.static('dist'))


//Middleware for console logs with info about petitions
morgan.token('post-body',(request,response)=>{
    if(request.method === 'POST')
        return JSON.stringify(request.body)
})
app.use(morgan(':method :url :status :response-time ms :post-body'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons =>{
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person =>{
        if (person) response.json(person)
        else response.status(404).end()
    })
})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        const date = new Date()
        let toPrint = `Phonebook has info for ${persons.length} people<br/>
        ${date}`
        response.send(toPrint)
    })
})

app.delete('/api/persons/:id', (request,response)=>{
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            console.log('Deleted: ',result.name)
            response.status(204).end()
        })
})

app.post('/api/persons',(request, response)=>{
    const body = request.body
    
    //Checks the request is good
    if(!body.name || !body.number)
        return response.status(400).json({error:'content missing'})
    
    //Checks if the person requested is already in the database
    Person.findOne({name:body.name}).then(found => {
        if(found)
            return response.status(400).json({error:'person already exists'})
        
        else{
           //Adds the person
            const person = new Person({
                name: body.name,
                number: body.number,
            })

            person.save().then(saved => {
                console.log(saved.name,' saved')
                response.json(saved)
            }) 
        }
    })
})

const PORT = process.env.PORT
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})