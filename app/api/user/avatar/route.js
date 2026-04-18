import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse(null, { status: 401 });
    }
    
    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user || (!user.image)) {
      return new NextResponse(null, { status: 404 });
    }

    // If it's a standard URL (like Google OAuth), redirect to it
    if (user.image.startsWith('http')) {
      return NextResponse.redirect(user.image);
    }

    // If it's a massive Data URL base64 string saved in MongoDB, extract the bytes to serve as a real image
    if (user.image.startsWith('data:image/')) {
      const matches = user.image.match(/^data:(.+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');
        return new NextResponse(buffer, {
          status: 200,
          headers: {
            'Content-Type': mimeType,
            'Content-Length': buffer.length.toString(),
            'Cache-Control': 'public, max-age=0, must-revalidate', // No cache so updates reflect instantly
          }
        });
      }
    }

    return new NextResponse(null, { status: 404 });
  } catch (err) {
    console.error('Avatar endpoint error:', err);
    return new NextResponse(null, { status: 500 });
  }
}
