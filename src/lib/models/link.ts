import mongoose, { Schema, model, models } from 'mongoose';

const LinkSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  list_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List',
    required: [true, 'List ID is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Link = models.Link || model('Link', LinkSchema);
