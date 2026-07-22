import { NextResponse } from 'next/server';

export async function POST() {
    return NextResponse.json(
        {
            status: 'ERROR',
            message: 'This checkout endpoint is retired. Orders must be submitted through the authenticated KAVON API.',
        },
        { status: 410 }
    );
}
