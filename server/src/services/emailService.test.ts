import test from 'node:test';
import assert from 'node:assert/strict';
import {
    sendVerificationEmail,
    trySendVerificationEmail,
} from './emailService';

const withEmailEnvironment = async (run: () => Promise<void>) => {
    const previous = {
        EMAIL_PASSWORD:    process.env.EMAIL_PASSWORD,
        EMAIL_FROM_NAME:   process.env.EMAIL_FROM_NAME,
        EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS,
        FRONTEND_URL:      process.env.FRONTEND_URL,
    };
    process.env.EMAIL_PASSWORD    = 'test-smtp-password';
    process.env.EMAIL_FROM_NAME   = 'KAVON';
    process.env.EMAIL_FROM_ADDRESS = 'verified@example.com';
    process.env.FRONTEND_URL      = 'https://kavon-net-official.vercel.app';

    try {
        await run();
    } finally {
        Object.entries(previous).forEach(([key, value]) => {
            if (value === undefined) delete process.env[key];
            else process.env[key] = value;
        });
    }
};

test('sends a branded verification email without exposing HTML input', async () => {
    await withEmailEnvironment(async () => {
        let capturedOptions: Record<string, unknown> = {};

        // Stub the nodemailer transporter so no real SMTP call is made
        const { default: nodemailer } = await import('nodemailer');
        const originalCreateTransport = nodemailer.createTransport.bind(nodemailer);
        (nodemailer as unknown as Record<string, unknown>).createTransport = () => ({
            sendMail: async (options: Record<string, unknown>) => {
                capturedOptions = options;
                return { messageId: 'test-id' };
            },
        });

        await sendVerificationEmail({
            recipientEmail: 'customer@example.com',
            recipientName: '<script>alert(1)</script>',
            token: 'a'.repeat(64),
        });

        assert.equal(capturedOptions.subject, 'Verify your KAVON account');
        assert.match(String(capturedOptions.html), /VERIFY MY EMAIL/);
        assert.match(String(capturedOptions.html), /token=/);
        assert.doesNotMatch(String(capturedOptions.html), /<script>alert/);
        assert.match(String(capturedOptions.html), /&lt;script&gt;/);

        // Restore
        (nodemailer as unknown as Record<string, unknown>).createTransport = originalCreateTransport;
    });
});

test('provider failure is contained so account creation can still succeed', async () => {
    await withEmailEnvironment(async () => {
        const { default: nodemailer } = await import('nodemailer');
        const originalCreateTransport = nodemailer.createTransport.bind(nodemailer);
        (nodemailer as unknown as Record<string, unknown>).createTransport = () => ({
            sendMail: async () => {
                throw new Error('SMTP unavailable');
            },
        });

        const result = await trySendVerificationEmail({
            recipientEmail: 'customer@example.com',
            recipientName: 'Customer',
            token: 'b'.repeat(64),
        });

        assert.equal(result, false);

        (nodemailer as unknown as Record<string, unknown>).createTransport = originalCreateTransport;
    });
});
