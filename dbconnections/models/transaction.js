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


const transactionSchema = mongoose.Schema({
  userPhoneNumber: { type: String, required: false },
  amount: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now }

})

const History = mongoose.model('History', transactionSchema)

module.exports = History;