'use server';

import { z } from 'zod';
import dbConnect from '../db/connect';
import User from '../models/user';
import { getUserFromSession } from './auth-actions';
import crypto from 'crypto';
import { getSubscriptionPlan, type SubscriptionPlan } from '../data/subscription-plans';

// Create UPI Payment Intent (for demonstration purposes)
// In a real implementation, this would integrate with a UPI payment gateway
export async function createUpiPaymentIntent(formData: FormData) {
  const planId = formData.get('planId') as string;
  const upiId = formData.get('upiId') as string || '';
  
  // Validate inputs
  if (!planId) {
    return { error: 'Missing required plan selection' };
  }
  
  // Get the subscription plan
  const plan = getSubscriptionPlan(planId);
  if (!plan) {
    return { error: 'Invalid subscription plan' };
  }
  
  // Get current user
  const user = await getUserFromSession();
  if (!user) {
    return { error: 'You must be logged in to subscribe' };
  }
  
  try {
    // Generate a transaction ID for reference
    const transactionId = crypto.randomBytes(16).toString('hex');
    
    // In a real implementation, this would call to a payment gateway API
    // For now, we'll simulate a successful payment
    
    // Store payment information for reference
    const paymentInfo = {
      transactionId,
      userId: user._id,
      planId,
      amount: plan.price,
      upiId,
      status: 'pending', // Initially pending
      createdAt: new Date(),
    };
    
    // This is where you would store payment info in the database
    // For a real implementation
    
    // Return a simulated payment URL or QR data
    // In production, this would return actual data from the payment provider
    return {
      success: true,
      paymentId: transactionId,
      paymentData: {
        upiUrl: `upi://pay?pa=${process.env.UPI_ID || 'merchant@upi'}&pn=TheUrlist&am=${plan.price}&tr=${transactionId}&cu=INR`,
        qrData: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${process.env.UPI_ID || 'merchant@upi'}&pn=TheUrlist&am=${plan.price}&tr=${transactionId}&cu=INR`,
        amount: plan.price,
        currency: 'INR',
        description: `Subscription to ${plan.name}`,
      },
    };
  } catch (error) {
    console.error('Payment intent creation error:', error);
    return { error: 'Failed to create payment intent' };
  }
}

// Verify and process UPI payment (webhook or manual verification)
export async function verifyUpiPayment(paymentId: string) {
  // In a real implementation, this would verify with the payment gateway
  // For now, we'll simulate successful verification
  
  try {
    // Get payment details from the database
    // This is simulated - in a real scenario, you'd fetch the actual record
    const paymentInfo = {
      transactionId: paymentId,
      userId: 'simulated-user-id', // In reality, fetch this from DB
      planId: 'premium-monthly', // In reality, fetch this from DB
      status: 'pending',
    };
    
    // Get the user and plan
    await dbConnect();
    const user = await User.findById(paymentInfo.userId);
    
    if (!user) {
      return { error: 'User not found' };
    }
    
    const plan = getSubscriptionPlan(paymentInfo.planId);
    
    if (!plan) {
      return { error: 'Invalid subscription plan' };
    }
    
    // Update user's subscription
    const startDate = new Date();
    let endDate;
    
    if (plan.type === 'lifetime') {
      // Set a very far future date for lifetime subscriptions
      endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 100);
    } else {
      // Calculate end date based on plan duration
      endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.duration);
    }
    
    // Update user subscription
    user.role = 'premium';
    user.subscription = {
      type: plan.type,
      startDate,
      endDate,
      active: true,
    };
    
    await user.save();
    
    // Update payment status
    // In a real implementation, update the payment record in DB
    
    return { success: true };
  } catch (error) {
    console.error('Payment verification error:', error);
    return { error: 'Failed to verify payment' };
  }
}

// Subscribe user to a plan (to be called after payment is verified)
export async function subscribeToPlan(planId: string) {
  const user = await getUserFromSession();
  
  if (!user) {
    return { error: 'You must be logged in to subscribe' };
  }
  
  const plan = getSubscriptionPlan(planId);
  
  if (!plan) {
    return { error: 'Invalid subscription plan' };
  }
  
  try {
    await dbConnect();
    
    const dbUser = await User.findById(user._id);
    
    if (!dbUser) {
      return { error: 'User not found' };
    }
    
    // Calculate subscription dates
    const startDate = new Date();
    let endDate;
    
    if (plan.type === 'lifetime') {
      // Set a very far future date for lifetime subscriptions
      endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 100);
    } else {
      // Calculate end date based on plan duration
      endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.duration);
    }
    
    // Update user subscription
    dbUser.role = 'premium';
    dbUser.subscription = {
      type: plan.type,
      startDate,
      endDate,
      active: true,
    };
    
    await dbUser.save();
    
    return { success: true };
  } catch (error) {
    console.error('Subscription error:', error);
    return { error: 'Failed to subscribe to plan' };
  }
}

// Check subscription status for a user
export async function getSubscriptionStatus() {
  const user = await getUserFromSession();
  
  if (!user) {
    return null;
  }
  
  // If user is admin, return full privileges
  if (user.role === 'admin') {
    return {
      isSubscribed: true,
      plan: 'admin',
      endDate: null,
      isLifetime: true,
    };
  }
  
  // Check if user has an active subscription
  if (user.role === 'premium' && user.subscription?.active) {
    const now = new Date();
    const endDate = new Date(user.subscription.endDate);
    
    // Check if subscription is still valid
    if (endDate > now || user.subscription.type === 'lifetime') {
      return {
        isSubscribed: true,
        plan: user.subscription.type,
        endDate: user.subscription.type === 'lifetime' ? null : endDate,
        isLifetime: user.subscription.type === 'lifetime',
      };
    }
    
    // Subscription has expired
    // In a production environment, you would have a cron job
    // to check and update expired subscriptions
    try {
      await dbConnect();
      
      const dbUser = await User.findById(user._id);
      
      if (dbUser) {
        dbUser.role = 'normal';
        dbUser.subscription.active = false;
        await dbUser.save();
      }
    } catch (error) {
      console.error('Error updating expired subscription:', error);
    }
  }
  
  // User has no subscription
  return {
    isSubscribed: false,
    plan: 'none',
    endDate: null,
    isLifetime: false,
  };
}
