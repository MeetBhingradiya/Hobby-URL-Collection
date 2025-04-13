import mongoose, { Schema, model, models } from 'mongoose';

const ListSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  privacy: {
    type: String,
    enum: ['public', 'private', 'invite-only'],
    default: 'public',
  },
  inviteLinks: [{
    token: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
});

export const List = models.List || model('List', ListSchema);
