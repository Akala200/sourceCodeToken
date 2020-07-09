import mongoose from 'mongoose';

const { Schema } = mongoose;

const walletSchema = new Schema({
  userPhoneNumber: { type: String },
  amount: { type: Number },
  createdAt: { type: Date, default: Date.now },
  coins: { type: Number },
});

const Wallet = mongoose.model('Wallet', walletSchema);

export default Wallet;
