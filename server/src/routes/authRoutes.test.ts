import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import type { Server } from 'node:http';
import User from '../models/User';
import authRoutes from './authRoutes';
import { createEmailVerificationChallenge } from '../utils/emailVerification';

const startServer = async () => {
    const app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);
    const server = await new Promise<Server>((resolve) => {
        const instance = app.listen(0, () => resolve(instance));
    });
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('Test server failed');
    return {
        server,
        url: `http://127.0.0.1:${address.port}/api/auth`,
    };
};

const closeServer = (server: Server) =>
    new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve()))
    );

test('registration remains successful when the email provider is unavailable', async () => {
    const originalFindOne = User.findOne;
    const originalSave = User.prototype.save;
    const originalEmailPassword = process.env.EMAIL_PASSWORD;
    delete process.env.EMAIL_PASSWORD;

    (User.findOne as unknown as (query: unknown) => Promise<null>) = async () => null;
    User.prototype.save = async function () {
        return this;
    };

    const { server, url } = await startServer();
    try {
        const response = await fetch(`${url}/register`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                name: 'Kavon Customer',
                email: 'CUSTOMER@EXAMPLE.COM',
                password: 'StrongPassword1',
            }),
        });
        const body = await response.json();

        assert.equal(response.status, 201);
        assert.equal(body.requiresEmailVerification, true);
        assert.equal(body.emailSent, false);
        assert.equal(body.user.email, 'customer@example.com');
        assert.equal(body.user.emailVerified, false);
        assert.equal('token' in body, false);
    } finally {
        await closeServer(server);
        User.findOne = originalFindOne;
        User.prototype.save = originalSave;
        if (originalEmailPassword === undefined) delete process.env.EMAIL_PASSWORD;
        else process.env.EMAIL_PASSWORD = originalEmailPassword;
    }
});

test('verification accepts a valid token once and clears the stored challenge', async () => {
    const originalFindOne = User.findOne;
    const challenge = createEmailVerificationChallenge(
        new Date(),
        () => Buffer.alloc(32, 0xef)
    );
    let saveCount = 0;
    const fakeUser = {
        emailVerified: false,
        emailVerifiedAt: undefined as Date | undefined,
        emailVerificationTokenHash: challenge.tokenHash as string | undefined,
        emailVerificationExpiresAt: challenge.expiresAt as Date | undefined,
        verificationEmailLastSentAt: challenge.issuedAt as Date | undefined,
        save: async () => {
            saveCount += 1;
        },
    };
    let lookupCount = 0;

    (User.findOne as unknown as (query: unknown) => { select: () => Promise<unknown> }) =
        () => ({
            select: async () => {
                lookupCount += 1;
                return lookupCount === 1 ? fakeUser : null;
            },
        });

    const { server, url } = await startServer();
    try {
        const first = await fetch(`${url}/verify-email`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ token: challenge.token }),
        });
        const second = await fetch(`${url}/verify-email`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ token: challenge.token }),
        });

        assert.equal(first.status, 200);
        assert.equal(second.status, 400);
        assert.equal(saveCount, 1);
        assert.equal(fakeUser.emailVerified, true);
        assert.equal(fakeUser.emailVerificationTokenHash, undefined);
        assert.equal(fakeUser.emailVerificationExpiresAt, undefined);
    } finally {
        await closeServer(server);
        User.findOne = originalFindOne;
    }
});

test('expired verification links return an explicit expired state', async () => {
    const originalFindOne = User.findOne;
    const token = 'f'.repeat(64);
    const fakeUser = {
        emailVerified: false,
        emailVerificationTokenHash:
            'ffe054fe7ae0cb6dc65c3af9b61d5209f439851db43d0ba5997337df154668eb',
        emailVerificationExpiresAt: new Date(Date.now() - 1000),
        save: async () => undefined,
    };

    // Use the actual supplied token hash so the handler reaches expiry logic.
    const { hashVerificationToken } = await import('../utils/emailVerification');
    fakeUser.emailVerificationTokenHash = hashVerificationToken(token);
    (User.findOne as unknown as (query: unknown) => { select: () => Promise<unknown> }) =
        () => ({ select: async () => fakeUser });

    const { server, url } = await startServer();
    try {
        const response = await fetch(`${url}/verify-email`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ token }),
        });
        const body = await response.json();
        assert.equal(response.status, 410);
        assert.equal(body.code, 'VERIFICATION_EXPIRED');
    } finally {
        await closeServer(server);
        User.findOne = originalFindOne;
    }
});

test('resend responses stay generic and replace the previous token after cooldown', async () => {
    const originalFindOne = User.findOne;
    let saveCount = 0;
    const fakeUser = {
        email: 'customer@example.com',
        name: 'Customer',
        emailVerified: false,
        emailVerificationTokenHash: 'old',
        emailVerificationExpiresAt: new Date(Date.now() - 1000),
        verificationEmailLastSentAt: new Date(Date.now() - 61_000),
        save: async () => {
            saveCount += 1;
        },
    };
    (User.findOne as unknown as (query: unknown) => { select: () => Promise<unknown> }) =
        () => ({ select: async () => fakeUser });

    const { server, url } = await startServer();
    try {
        const response = await fetch(`${url}/resend-verification`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ email: 'customer@example.com' }),
        });
        const body = await response.json();

        assert.equal(response.status, 200);
        assert.match(body.message, /If an unverified account exists/);
        assert.equal(saveCount, 2);
        assert.notEqual(fakeUser.emailVerificationTokenHash, 'old');
        assert.equal(fakeUser.verificationEmailLastSentAt, undefined);
    } finally {
        await closeServer(server);
        User.findOne = originalFindOne;
    }
});

test('registration limiter rejects attempts beyond the configured boundary', async () => {
    const originalFindOne = User.findOne;
    (User.findOne as unknown as (query: unknown) => Promise<object>) = async () => ({});
    const { server, url } = await startServer();

    try {
        const statuses: number[] = [];
        // One registration request was already counted by an earlier test.
        for (let index = 0; index < 5; index += 1) {
            const response = await fetch(`${url}/register`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    name: 'Rate Test',
                    email: `rate-${index}@example.com`,
                    password: 'StrongPassword1',
                }),
            });
            statuses.push(response.status);
        }
        assert.equal(statuses[statuses.length - 1], 429);
    } finally {
        await closeServer(server);
        User.findOne = originalFindOne;
    }
});
