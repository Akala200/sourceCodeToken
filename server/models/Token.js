import mongoose from 'mongoose';

const { Schema } = mongoose;

const tokenSchema = new Schema({
  token: { type: String },
  user: { type: String, ref: 'User' },
});

const Token = mongoose.model('Token', tokenSchema);

export default Token;
