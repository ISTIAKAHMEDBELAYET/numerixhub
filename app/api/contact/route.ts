import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    // Length check before validation to prevent ReDoS
    if (typeof email !== 'string' || email.length > 254) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Simple linear-time email check: one @, at least one dot in domain
    const atIndex = email.indexOf('@');
    if (atIndex < 1 || atIndex !== email.lastIndexOf('@') || !email.slice(atIndex + 1).includes('.')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // TODO: Integrate with email service (e.g., SendGrid, Resend, nodemailer)
    console.log('Contact form submission:', { name, email, subject, message });

    return NextResponse.json({ message: 'Message sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
