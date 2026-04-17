import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/react';
import { authOptions } from '../../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Resume from '@/models/Resume';

// Helper to check ownership
async function authorizeResume(req, id) {
  const session = await getServerSession(authOptions);
  if (!session) return { error: 'Unauthorized', status: 401 };

  await dbConnect();
  const user = await User.findById(session.user.id);
  if (!user) return { error: 'User not found', status: 404 };

  const resume = await Resume.findById(id);
  if (!resume) return { error: 'Resume not found', status: 404 };

  if (resume.userId.toString() !== user._id.toString()) {
    return { error: 'Forbidden', status: 403 };
  }

  return { user, resume };
}

// GET single resume by ID
export async function GET(req, { params }) {
  try {
    const { id } = params;
    const { error, status, resume } = await authorizeResume(req, id);
    
    if (error) {
      return NextResponse.json({ message: error }, { status });
    }

    return NextResponse.json({ resume }, { status: 200 });
  } catch (error) {
    console.error('Fetch Single Resume Error', error);
    return NextResponse.json({ message: 'Error fetching resume' }, { status: 500 });
  }
}

// DELETE single resume by ID
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const { error, status, resume } = await authorizeResume(req, id);
    
    if (error) {
      return NextResponse.json({ message: error }, { status });
    }

    await Resume.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Resume deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete Resume Error', error);
    return NextResponse.json({ message: 'Error deleting resume' }, { status: 500 });
  }
}
