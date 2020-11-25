import mongoose from 'mongoose';
// import { v1 as uuid1 } from 'uuid';

const transactionSchema = mongoose.Schema({
  amount: { type: Number, required: true },
  coins: { type: Number, required: true },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  mode: { type: String, required: true },
  email: { type: String, required: true },
  user: { type: String, required: true },
  cardType: { type: String },
  lastFour: { type: String },
  ref: { type: String, required: true },
  walletId: { type: mongoose.Schema.ObjectId, ref: 'Wallet' },
  status: {
    type: String,
    enum: ['pending', 'successful', 'failed'],
    required: true,
  },
  createdAt: { type: Date, required: true, default: Date.now },
  deletedAt: { type: Date, default: null },
});
const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
