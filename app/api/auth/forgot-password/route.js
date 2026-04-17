import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ email });

    if (!user) {
      // Don't leak that the user doesn't exist for security reasons
      return NextResponse.json({ message: "If an account with that email exists, we sent a password reset link." });
    }

    if (user.provider === 'google' && !user.password) {
       return NextResponse.json({ error: "This account was created with Google. Please sign in with Google." }, { status: 400 });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetPasswordExpires = Date.now() + 3600000; // 1 hour

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    const message = `
      You are receiving this email because you (or someone else) has requested the reset of a password.
      Please click on the following link, or paste this into your browser to complete the process:
      ${resetUrl}
      This link will expire in one hour.
    `;

    // Only send actual email if SMTP variables exist, otherwise log it
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `CVGenius AI <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: user.email,
        subject: "Password Reset Request",
        text: message,
      });
    } else {
      console.log('====== EMAIL NOT SENT (SMTP NOT CONFIGURED) ======');
      console.log(message);
      console.log('===================================================');
    }

    return NextResponse.json({ message: "If an account with that email exists, we sent a password reset link." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Failed to send reset link." }, { status: 500 });
  }
}
