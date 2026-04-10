import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  },
  assignedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  assignedTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  },
  assignedTarget: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

const Task = mongoose.model('Task', taskSchema);
export default Task;
