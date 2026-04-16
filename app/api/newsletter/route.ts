import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Length check before regex to prevent ReDoS
    if (email.length > 254) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Simple linear-time email check: one @, at least one dot in domain
    const atIndex = email.indexOf('@');
    if (atIndex < 1 || atIndex !== email.lastIndexOf('@') || !email.slice(atIndex + 1).includes('.')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // TODO: Integrate with email service provider (e.g., Mailchimp, ConvertKit)
    console.log('Newsletter subscription:', email);

    return NextResponse.json({ message: 'Successfully subscribed!' }, { status: 200 });
  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
