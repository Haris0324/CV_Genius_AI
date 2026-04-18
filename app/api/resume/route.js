import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Resume from '@/models/Resume';
import { redis } from '@/lib/redis';

// Fetch all resumes for the authenticated user
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const resumes = await Resume.find({ userId: user._id }).sort({ updatedAt: -1 });

    // Fetch limits
    let limitsUsed = 0;
    if (redis && user.subscription !== 'PRO' && user.subscription !== 'PREMIUM') {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const key = `resume_count:${user._id.toString()}:${currentMonth}`;
      const count = await redis.get(key);
      limitsUsed = count ? parseInt(count) : 0;
    }

    return NextResponse.json({ resumes, limitsUsed }, { status: 200 });

  } catch (error) {
    console.error('Fetch Resumes Error', error);
    return NextResponse.json({ message: 'Error fetching resumes' }, { status: 500 });
  }
}
