/* eslint-disable no-unused-vars */
/* eslint-disable arrow-spacing */
const mongoose = require('mongoose')

if(process.argv.length <3) {
    console.log('password needed')
    process.exit(1)
}

const showContent = process.argv.length === 3

if (!showContent && process.argv.length < 5) {
    console.log('number needed')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://vixadd27:${password}@fullstackcluster0.6abdsls.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema(
    {
        name: String,
        number: String,
    }
)

const Person = mongoose.model('Person', personSchema)

//Mode with 3 arguments that shows the content of the database
if(showContent){
    console.log('Phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name,person.number)
        })
        mongoose.connection.close()
    })
}
//Mode with 5 arguments that adds a person to the database
else {
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name: name,
        number: number,
    })
    person.save().then(result =>{
        console.log(`Added ${name} with number ${number} to phonebook`)
        mongoose.connection.close()
    })
}