import mongoose from 'mongoose';

const { Schema } = mongoose;

const walletSchema = new Schema({
  email: { type: String },
  phone: { type: String },
  balance: { type: Number, default: 0 },
  coin: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

const Wallet = mongoose.model('Wallet', walletSchema);

export default Wallet;
