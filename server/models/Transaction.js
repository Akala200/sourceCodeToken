import mongoose from 'mongoose';
import Promise from 'bluebird';
import { v1 as uuid1 } from 'uuid';

// Todo enum mode, status and. /utils/generatorstype as validation guide
const transactionSchema = mongoose.Schema({
  amount: { type: Number, required: true },
  coins: { type: Number, required: true },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  mode: { type: String, required: true },
  meta: { type: Object },
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
/* eslint-disable func-names */
transactionSchema.static('createTransferTransaction', Promise.method(function (object) {
  const fromObject = {
    amount: object.amount,
    coins: object.amount,
    type: 'debit',
    walletId: object.fromId,
    mode: 'walletToWalletTransfer',
    meta: {
      fromId: object.fromId,
      toId: object.toId,
    },
    ref: uuid1(),
    status: 'successful',
  };
  const toObject = {
    amount: object.amount,
    coins: object.amount,
    type: 'credit',
    walletId: object.toId,
    mode: 'walletToWalletTransfer',
    meta: {
      fromId: object.fromId,
      toId: object.toId,
    },
    ref: uuid1(),
    status: 'successful',
  };
  return this.insertMany([fromObject, toObject]).exec;
}));
const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
