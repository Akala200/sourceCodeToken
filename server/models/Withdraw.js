import mongoose from 'mongoose';

const { Schema } = mongoose;

const WalletWalletSchema = new Schema({
  fullName: { type: String },
  phone: { type: String },
  email: { type: String },
  user: { type: String },
  account_number: { type: String },
  account_bank: { type: String },
  amount: { type: Number },
  coin_value: { type: Number },
  coin_type: { type: String },
  payout_status: { type: String, default: false },
  createdAt: { type: Date, default: Date.now },
});

const WalletWallet = mongoose.model('WalletWallet', WalletWalletSchema);

export default WalletWallet;
