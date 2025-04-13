import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'premium' | 'normal';
  subscription: {
    type: 'none' | 'monthly' | 'yearly' | 'lifetime';
    startDate: Date;
    endDate: Date;
    active: boolean;
  };
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
  createdAt: Date;
  listsCreated: number;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password should be at least 6 characters'],
  },
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  role: {
    type: String,
    enum: ['admin', 'premium', 'normal'],
    default: 'normal',
  },
  subscription: {
    type: {
      type: String,
      enum: ['none', 'monthly', 'yearly', 'lifetime'],
      default: 'none',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: Date.now,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  resetPasswordToken: String,
  resetPasswordExpiry: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  listsCreated: {
    type: Number,
    default: 0,
  },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
