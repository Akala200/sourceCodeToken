import mongoose from 'mongoose';

const { Schema } = mongoose;

const BankSchema = new Schema({
  accountName: { type: String },
  accountNumber: { type: String },
  email: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Bank = mongoose.model('Bank', BankSchema);

export default Bank;
