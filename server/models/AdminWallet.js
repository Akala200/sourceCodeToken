import mongoose from 'mongoose';

const { Schema } = mongoose;

const AdminWalletSchema = new Schema({
  email: { type: String },
  phone: { type: String },
  role: { type: String, default: 'Admin' },
  balance: { type: Number, default: 0 },
  eth_balance: { type: Number, default: 0 },
  bch_balance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const AdminWallet = mongoose.model('AdminWallet', AdminWalletSchema);

export default AdminWallet;
