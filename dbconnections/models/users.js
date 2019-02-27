const mongoose = require('mongoose');


const server = process.env.DB_SERVER
const database = process.env.DB_NAME
const user = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD


mongoose.connect(`mongodb://${user}:${password}@${server}/${database}`, { useNewUrlParser: true }, function(err) {
    if (err) {throw err
    } else{
        console.log('You connected to a database')
    }
});

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userPhoneNumber: { type: String, required: true },
  accountBalance: { type: String, required: false },
  createdAt: { type: Date, required: true, default: Date.now }
})

const User = mongoose.model('Users', userSchema)

module.exports = User;