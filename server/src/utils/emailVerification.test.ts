import test from 'node:test';
import assert from 'node:assert/strict';
import {
    createEmailVerificationChallenge,
    getResendWaitSeconds,
    getVerificationTokenStatus,
    hashVerificationToken,
} from './emailVerification';

test('creates a deterministic 32-byte challenge and stores only its SHA-256 hash', () => {
    const now = new Date('2026-07-24T00:00:00.000Z');
    const challenge = createEmailVerificationChallenge(
        now,
        () => Buffer.alloc(32, 0xab)
    );

    assert.equal(challenge.token.length, 64);
    assert.equal(challenge.tokenHash, hashVerificationToken(challenge.token));
    assert.notEqual(challenge.token, challenge.tokenHash);
    assert.equal(challenge.issuedAt.toISOString(), now.toISOString());
    assert.equal(
        challenge.expiresAt.toISOString(),
        '2026-07-25T00:00:00.000Z'
    );
});
test('accepts a valid token and rejects modified, expired, and reused tokens', () => {
    const issuedAt = new Date('2026-07-24T00:00:00.000Z');
    const challenge = createEmailVerificationChallenge(
        issuedAt,
        () => Buffer.alloc(32, 0xcd)
    );
    const common = {
        storedTokenHash: challenge.tokenHash,
        expiresAt: challenge.expiresAt,
        emailVerified: false,
    };

    assert.equal(
        getVerificationTokenStatus({
            ...common,
            suppliedToken: challenge.token,
            now: new Date('2026-07-24T01:00:00.000Z'),
        }),
        'valid'
    );
    assert.equal(
        getVerificationTokenStatus({
            ...common,
            suppliedToken: `${challenge.token.slice(0, -1)}0`,
            now: new Date('2026-07-24T01:00:00.000Z'),
        }),
        'invalid'
    );
    assert.equal(
        getVerificationTokenStatus({
            ...common,
            suppliedToken: challenge.token,
            now: challenge.expiresAt,
        }),
        'expired'
    );
    assert.equal(
        getVerificationTokenStatus({
            suppliedToken: challenge.token,
            emailVerified: true,
            now: new Date('2026-07-24T01:00:00.000Z'),
        }),
        'already_verified'
    );
    assert.equal(
        getVerificationTokenStatus({
            suppliedToken: challenge.token,
            emailVerified: false,
            now: new Date('2026-07-24T01:00:00.000Z'),
        }),
        'invalid'
    );
});

test('enforces a 60-second resend cooldown', () => {
    const lastSentAt = new Date('2026-07-24T00:00:00.000Z');
    assert.equal(
        getResendWaitSeconds(lastSentAt, new Date('2026-07-24T00:00:01.000Z')),
        59
    );
    assert.equal(
        getResendWaitSeconds(lastSentAt, new Date('2026-07-24T00:01:00.000Z')),
        0
    );
});
