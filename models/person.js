/* eslint-disable no-unused-vars */
require('dotenv')
const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(_result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting: ', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true,
    },
    number: {
        type: String,
        validate: {
            validator : value => {
                return /^\d{2,3}-.*$/.test(value)
            },
            message : 'Phone format is not valid',
        },
        minLength: 8,
        required: true,
    },
})

personSchema.set('toJSON', {
    transform: (_document,returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)