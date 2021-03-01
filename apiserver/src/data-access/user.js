import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, createIndexes: { unique: true } },
  password: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  role: {
    type: String,
    enum: ['ADMIN', 'BASIC'],
    default: 'BASIC',
    required: true,
  },
});

UserSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.comparePassword = async function comparePassword(password) {
  console.log('password received: ', password);
  console.log('user password: ', this.password);
  return bcrypt.compare(password, this.password);
};

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
