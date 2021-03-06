import mongoose from 'mongoose';

const { Schema } = mongoose;

const BankSchema = new Schema({
  accountName: { type: String },
  accountNumber: { type: String },
  id: { type: String },
  account_bank: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Bank = mongoose.model('Bank', BankSchema);

export default Bank;
