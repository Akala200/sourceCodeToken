import mongoose from 'mongoose';

const { Schema } = mongoose;

const transactionSchema = new Schema({
  userPhoneNumber: { type: String },
  amount: { type: String},
  createdAt: { type: Date, default: Date.now }

});

const Wallet = mongoose.model('Wallet', transactionSchema);

export default Wallet;
