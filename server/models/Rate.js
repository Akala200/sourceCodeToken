import mongoose from 'mongoose';

const { Schema } = mongoose;

const RateSchema = new Schema({
  variable_rate: { type: String },
  fixed_rate: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Rate = mongoose.model('Rate', RateSchema);

export default Rate;
