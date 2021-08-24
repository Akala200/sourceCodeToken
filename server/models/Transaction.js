import mongoose from 'mongoose';
// import { v1 as uuid1 } from 'uuid';

const transactionSchema = mongoose.Schema({
  amount: { type: Number },
  coins: { type: Number },
  type: { type: String, enum: ['credit', 'debit'] },
  mode: { type: String },
  coinType: { type: String },
  user: { type: String },
  email: { type: String },
  cardType: { type: String },
  lastFour: { type: String },
  ref: { type: String },
  walletId: { type: mongoose.Schema.ObjectId, ref: 'Wallet' },
  status: {
    type: String,
    enum: ['pending', 'successful', 'failed'],
  },
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
});
const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
