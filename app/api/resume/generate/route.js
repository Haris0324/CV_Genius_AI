import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { openai } from '@/lib/openai';
import { redis } from '@/lib/redis';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Resume from '@/models/Resume';

// Helper to check user limits
async function checkLimits(userId, plan) {
  if (plan === 'PRO' || plan === 'PREMIUM') return true;
  
  // Free plan limit check using Redis
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const key = `resume_count:${userId}:${currentMonth}`;
  
  let count = await redis.get(key);
  if (!count) count = 0;
  
  if (parseInt(count) >= 3) {
    return false; // Limit exceeded
  }
  return true;
}

// Helper to increment usage
async function incrementUsage(userId, plan) {
  if (plan === 'PRO' || plan === 'PREMIUM') return;
  
  const currentMonth = new Date().toISOString().slice(0, 7);
  const key = `resume_count:${userId}:${currentMonth}`;
  
  // Set expiration for 35 days to auto-clean old keys
  await redis.incr(key);
  await redis.expire(key, 60 * 60 * 24 * 35);
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { personalInfo, experience, education, skills, targetJob } = await req.json();

    await dbConnect();
    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check limits
    if (redis) {
      const isAllowed = await checkLimits(user._id.toString(), user.subscription);
      if (!isAllowed) {
        return NextResponse.json({ message: 'Free limit exceeded. Please upgrade.' }, { status: 403 });
      }
    }

    // Construct prompt
    const systemPrompt = `You are an expert ATS-friendly resume writer. Your job is to take the user's raw input and format it into a professional, highly polished resume tailored for the role of "${targetJob}". Focus on strong action verbs and quantifiable achievements. Return ONLY a valid JSON object with the following structure:
{
  "summary": "Professional summary paragraph...",
  "experience": [
    { "company": "...", "role": "...", "duration": "...", "description": ["bullet 1", "bullet 2"] }
  ],
  "education": [
    { "institution": "...", "degree": "...", "year": "..." }
  ],
  "skills": ["skill 1", "skill 2"]
}`;

    const userPrompt = `
      Name: ${personalInfo.name}
      Email: ${personalInfo.email}
      Target Job: ${targetJob}
      
      Raw Skills: ${skills}
      
      Raw Experience:
      ${experience}
      
      Raw Education:
      ${education}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
    });

    const aiContent = JSON.parse(completion.choices[0].message.content);

    // Save to DB
    const newResume = await Resume.create({
      userId: user._id,
      title: `${targetJob} Resume`,
      content: aiContent,
      template: 'modern'
    });

    if (redis) {
      await incrementUsage(user._id.toString(), user.subscription);
    }

    return NextResponse.json({ resume: newResume }, { status: 201 });

  } catch (error) {
    console.error('AI Generation Error', error);
    return NextResponse.json({ message: 'Error generating resume' }, { status: 500 });
  }
}
