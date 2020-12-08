import mongoose from 'mongoose';

const { Schema } = mongoose;

const CommissionSchema = new Schema({
  amount: { type: String },
  coin: { type: String },
  from: { type: String },
  type: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Commission = mongoose.model('Commission', CommissionSchema);

export default Commission;
