import mongoose from 'mongoose';

const { Schema } = mongoose;

const RateSchema = new Schema({
  variable_rate: { type: Number },
  sale_rate: { type: Number },
  transfer: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

const Rate = mongoose.model('Rate', RateSchema);

export default Rate;
