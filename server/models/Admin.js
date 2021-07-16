import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { isEmail } from 'validator';

const saltRounds = 10; // or another integer in that ballpark

const { Schema } = mongoose;

const AdminSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      unique: true,
      validate: [isEmail, 'invalid email'],
    },
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    guid: {
      type: String,
    },
    address: {
      type: String,
    },
    tempt: {
      type: String,
    },
    eth_address: {
      type: String,
    },
    eth_tempt: {
      type: String,
    },
    bch_address: {
      type: String,
    },
    bch_tempt: {
      type: String,
    },
    role: {
      type: String,
      default: 'Super Admin',
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// eslint-disable-next-line func-names
AdminSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});

const Admin = mongoose.model('Admin', AdminSchema);

export default Admin;
