import { NextResponse } from 'next/server';
import { getSubscriptionStatus } from '@/lib/actions/payment-actions';

export async function GET() {
  try {
    const subscription = await getSubscriptionStatus();
    
    if (!subscription) {
      return NextResponse.json(
        { subscription: null }, 
        { status: 200 }
      );
    }
    
    return NextResponse.json({ subscription }, { status: 200 });
  } catch (error) {
    console.error('Error fetching subscription data:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
