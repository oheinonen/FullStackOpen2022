const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  } )

const personsSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    minlength: 8,
    validate: {
      validator: function(v) {
        return (/\d{3}-\d{7}/).test(v) || (/\d{2}-\d{8}/ ).test(v)
      },
      message: props => `${props.value} is not a valid phone number! Format is 12-12345678 or 123-1234567`,
      required: true
    }
  },
  id: Number
})
personsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personsSchema)
