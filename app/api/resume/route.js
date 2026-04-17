import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/react';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Resume from '@/models/Resume';

// Fetch all resumes for the authenticated user
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const resumes = await Resume.find({ userId: user._id }).sort({ updatedAt: -1 });

    return NextResponse.json({ resumes }, { status: 200 });

  } catch (error) {
    console.error('Fetch Resumes Error', error);
    return NextResponse.json({ message: 'Error fetching resumes' }, { status: 500 });
  }
}
