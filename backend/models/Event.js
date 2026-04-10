import mongoose from 'mongoose';

const subEventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sub-event name is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  assignedTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  },
  participantsLimit: {
    type: Number,
    min: 0,
    default: 0,
  },
  participantsCount: {
    type: Number,
    default: 0,
  },
  participants: [
    {
      name: { type: String, required: true, trim: true },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      performanceTitle: { type: String, required: true, trim: true },
      performanceType: {
        type: String,
        enum: ['Solo', 'Group'],
        default: 'Solo',
        trim: true,
      },
      assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      status: {
        type: String,
        enum: ['Registered', 'Approved', 'Rejected'],
        default: 'Registered',
      },
    },
  ],
  tasks: [
    {
      title: { type: String, trim: true },
      description: { type: String, trim: true },
      status: { type: String, trim: true, default: 'Pending' },
    },
  ],
}, { _id: true });

const eventSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  location: {
    type: String,
    trim: true,
  },
  activityType: {
    type: String,
    trim: true,
    default: 'other',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  subEvents: {
    type: [subEventSchema],
    default: [],
  },
  images: [
    {
      type: String,
      trim: true,
    },
  ],
  videos: [
    {
      type: String,
      trim: true,
    },
  ],
}, {
  timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
