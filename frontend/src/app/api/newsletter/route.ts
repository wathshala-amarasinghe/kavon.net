import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend('your_resend_api_key');

export async function POST(req: Request) {
    const { email } = await req.json();

    try {
        // This adds them to your audience list
        await resend.contacts.create({
            email: email,
            unsubscribed: false,
            audienceId: 'your_audience_id',
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to join community." }, { status: 500 });
    }
}