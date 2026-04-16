import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import WelcomeEmail from "@/emails/WelcomeEmail";
import MarketingNotificationEmail from "@/emails/MarketingNotificationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'noreply@namibiaservices.com';
const MARKETING_EMAIL = 'marketing@namibiaservices.com';

export async function POST(request: NextRequest) {
  try {
    console.log('\n========== EMAIL SEND API REQUEST ==========');
    const body = await request.json();
    console.log('Email request body:', body);
    const {
      businessName,
      businessOwnerEmail,
      businessCategory,
      businessPhone,
      businessAddress,
      type = "welcome", // "welcome" or "marketing"
    } = body;

    if (!businessName || !businessOwnerEmail) {
      console.log('❌ Missing required fields');
      return NextResponse.json(
        { error: "Missing required fields: businessName, businessOwnerEmail" },
        { status: 400 }
      );
    }

    if (type === "welcome") {
      console.log('\n--- Sending WELCOME email ---');
      console.log('To:', businessOwnerEmail);
      console.log('From:', FROM_EMAIL);
      console.log('Subject:', `Welcome to Namibia Services - ${businessName}`);

      // Send welcome email to business owner
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: businessOwnerEmail,
        subject: `Welcome to Namibia Services - ${businessName}`,
        react: WelcomeEmail({
          businessName: businessName,
          businessOwnerEmail: businessOwnerEmail,
          businessCategory: businessCategory,
        }),
      });

      console.log('✅ Resend API response:', result);

      return NextResponse.json({ success: true, message: "Welcome email sent", data: result });
    } else if (type === "marketing") {
      console.log('\n--- Sending MARKETING notification ---');
      console.log('To:', MARKETING_EMAIL);
      console.log('From:', FROM_EMAIL);
      console.log('Subject:', `New Business Registration: ${businessName}`);

      // Send notification to marketing team
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: MARKETING_EMAIL,
        subject: `New Business Registration: ${businessName}`,
        react: MarketingNotificationEmail({
          businessName: businessName,
          businessOwnerEmail: businessOwnerEmail,
          businessCategory: businessCategory,
          businessPhone: businessPhone,
          businessAddress: businessAddress,
        }),
      });

      console.log('✅ Resend API response:', result);

      return NextResponse.json({
        success: true,
        message: "Marketing notification sent",
        data: result
      });
    } else {
      return NextResponse.json(
        { error: "Invalid type. Must be 'welcome' or 'marketing'" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('\n❌ ========== EMAIL SEND ERROR ==========');
    console.error("Email sending error:", error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('=========================================\n');
    return NextResponse.json(
      { error: "Failed to send email", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
