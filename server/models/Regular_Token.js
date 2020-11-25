import mongoose from 'mongoose';

const { Schema } = mongoose;

const tokenUsedSchema = new Schema({
  token: { type: String },
  oldEmail: { type: String, ref: 'User' },
  newEmail: { type: String },
  phone: { type: String, ref: 'User' },
});

const TokenUsed = mongoose.model('TokenUsed', tokenUsedSchema);

export default TokenUsed;
