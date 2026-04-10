import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false,
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['admin', 'student'],
    default: 'student',
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);
export default User;
