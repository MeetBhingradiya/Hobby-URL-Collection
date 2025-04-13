import { NextResponse } from 'next/server';
import { getUserFromSession } from '@/lib/actions/auth-actions';

export async function GET() {
  try {
    const user = await getUserFromSession();
    
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    
    // Remove sensitive information
    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      listsCreated: user.listsCreated,
    };
    
    return NextResponse.json({ user: safeUser }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
