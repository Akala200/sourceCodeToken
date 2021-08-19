import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { isEmail } from 'validator';


const saltRounds = 10; // or another integer in that ballpark

const { Schema } = mongoose;


const UserSchema = new Schema(
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
    payment_coin_type: {
      type: String,
    },
    payment_bitcoin: {
      type: String,
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
    label: {
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
    bankref: {
      type: String,
    },
    bvn_verified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: true,
    },
    regstatus: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// eslint-disable-next-line func-names
UserSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});


const User = mongoose.model('User', UserSchema);

export default User;
