'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignJWT, jwtVerify } from 'jose';
import { z } from 'zod';
import User from '../models/user';
import dbConnect from '../db/connect';
import crypto from 'crypto';
import sendEmail from '../utils/send-email';

// JWT utilities
const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_key_for_development_only'
);

export async function createSession(userId: string) {
  // Create a JWT token
  const token = await new SignJWT({ id: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);

  // Set the token as an HTTP-only cookie
  cookies().set({
    name: 'session',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getUserFromSession() {
  const sessionCookie = cookies().get('session')?.value;
  
  if (!sessionCookie) {
    return null;
  }

  try {
    // Verify the JWT token
    const { payload } = await jwtVerify(sessionCookie, secretKey);
    
    await dbConnect();
    
    // Find the user
    const user = await User.findById(payload.id).select('-password');
    
    if (!user) {
      return null;
    }
    
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    // If token is invalid, clear the cookie
    cookies().delete('session');
    return null;
  }
}

export async function logout() {
  cookies().delete('session');
  redirect('/');
}

// User registration schema
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function register(formData: FormData) {
  const validatedFields = registerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.errors[0].message };
  }

  const { name, email, password } = validatedFields.data;

  try {
    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return { error: 'User already exists with this email' };
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: 'normal',
      subscription: {
        type: 'none',
        active: false,
      },
    });

    // Create session
    await createSession(user._id.toString());

    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Failed to register. Please try again.' };
  }
}

// Login schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function login(formData: FormData) {
  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.errors[0].message };
  }

  const { email, password } = validatedFields.data;

  try {
    await dbConnect();

    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      return { error: 'Invalid email or password' };
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return { error: 'Invalid email or password' };
    }

    // Create session
    await createSession(user._id.toString());

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Failed to login. Please try again.' };
  }
}

// Forgot password
export async function forgotPassword(formData: FormData) {
  const email = formData.get('email') as string;
  
  if (!email) {
    return { error: 'Email is required' };
  }

  try {
    await dbConnect();

    const user = await User.findOne({ email });
    
    if (!user) {
      // Don't reveal that the user doesn't exist for security reasons
      return { success: true };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token and save to database
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    const resetPasswordExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpiry = resetPasswordExpiry;
    
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${resetToken}`;
    
    // Send email
    await sendEmail({
      to: user.email,
      subject: 'Password Reset - The Urlist',
      text: `You requested a password reset. Please visit: ${resetUrl} to reset your password. This link is valid for 10 minutes.`,
      html: `
        <p>You requested a password reset.</p>
        <p>Please click <a href="${resetUrl}">here</a> to reset your password.</p>
        <p>This link is valid for 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      `
    });

    return { success: true };
  } catch (error) {
    console.error('Forgot password error:', error);
    return { error: 'Failed to process your request. Please try again.' };
  }
}

// Reset password schema
const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export async function resetPassword(token: string, formData: FormData) {
  const validatedFields = resetPasswordSchema.safeParse({
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.errors[0].message };
  }

  const { password } = validatedFields.data;

  try {
    // Hash the token to compare with the stored hashed token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    await dbConnect();

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return { error: 'Invalid or expired token' };
    }

    // Update password and clear reset token fields
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    
    await user.save();

    return { success: true };
  } catch (error) {
    console.error('Reset password error:', error);
    return { error: 'Failed to reset password. Please try again.' };
  }
}

// Check if user can create more lists
export async function canCreateList() {
  const user = await getUserFromSession();
  
  if (!user) {
    return false;
  }
  
  // Admin and premium users can create unlimited lists
  if (user.role === 'admin' || user.role === 'premium') {
    return true;
  }
  
  // Normal users are limited to 1 list
  return user.listsCreated < 1;
}

// Increment list count for a user
export async function incrementListCount() {
  const user = await getUserFromSession();
  
  if (!user) {
    return;
  }
  
  await dbConnect();
  await User.findByIdAndUpdate(user._id, { $inc: { listsCreated: 1 } });
}
