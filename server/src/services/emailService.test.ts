import test from 'node:test';
import assert from 'node:assert/strict';
import {
    sendVerificationEmail,
    trySendVerificationEmail,
} from './emailService';

const withEmailEnvironment = async (run: () => Promise<void>) => {
    const previous = {
        BREVO_API_KEY: process.env.BREVO_API_KEY,
        EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,
        EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS,
        FRONTEND_URL: process.env.FRONTEND_URL,
    };
    process.env.BREVO_API_KEY = 'test-api-key';
    process.env.EMAIL_FROM_NAME = 'KAVON';
    process.env.EMAIL_FROM_ADDRESS = 'verified@example.com';
    process.env.FRONTEND_URL = 'https://kavon-net-official.vercel.app';

    try {
        await run();
    } finally {
        Object.entries(previous).forEach(([key, value]) => {
            if (value === undefined) delete process.env[key];
            else process.env[key] = value;
        });
    }
};

test('sends a branded verification request through Brevo without exposing HTML input', async () => {
    await withEmailEnvironment(async () => {
        let requestBody = '';
        const fakeFetch = async (_input: string | URL | Request, init?: RequestInit) => {
            requestBody = String(init?.body || '');
            return new Response(null, { status: 201 });
        };

        await sendVerificationEmail({
            recipientEmail: 'customer@example.com',
            recipientName: '<script>alert(1)</script>',
            token: 'a'.repeat(64),
            fetchImplementation: fakeFetch,
        });

        const payload = JSON.parse(requestBody);
        assert.equal(payload.subject, 'Verify your KAVON account');
        assert.match(payload.htmlContent, /VERIFY MY EMAIL/);
        assert.match(payload.htmlContent, /%3Ftoken%3D|token%3D|token=/);
        assert.doesNotMatch(payload.htmlContent, /<script>alert/);
        assert.match(payload.htmlContent, /&lt;script&gt;/);
    });
});
test('provider failure is contained so account creation can still succeed', async () => {
    await withEmailEnvironment(async () => {
        const result = await trySendVerificationEmail({
            recipientEmail: 'customer@example.com',
            recipientName: 'Customer',
            token: 'b'.repeat(64),
            fetchImplementation: async () => {
                throw new Error('Provider unavailable');
            },
        });

        assert.equal(result, false);
    });
});
