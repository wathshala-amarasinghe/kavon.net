import crypto from 'crypto';

export const EMAIL_VERIFICATION_TOKEN_BYTES = 32;
export const DEFAULT_EMAIL_VERIFICATION_EXPIRY_HOURS = 24;
export const VERIFICATION_RESEND_COOLDOWN_SECONDS = 60;

export interface EmailVerificationChallenge {
    token: string;
    tokenHash: string;
    expiresAt: Date;
    issuedAt: Date;
}

export type VerificationTokenStatus =
    | 'valid'
    | 'invalid'
    | 'expired'
    | 'already_verified';

const getExpiryHours = () => {
    const parsed = Number(process.env.EMAIL_VERIFICATION_EXPIRY_HOURS);
    if (!Number.isFinite(parsed) || parsed <= 0 || parsed > 168) {
        return DEFAULT_EMAIL_VERIFICATION_EXPIRY_HOURS;
    }
    return parsed;
};
export const hashVerificationToken = (token: string) =>
    crypto.createHash('sha256').update(token, 'utf8').digest('hex');

export const createEmailVerificationChallenge = (
    now = new Date(),
    randomBytes: (size: number) => Buffer = crypto.randomBytes
): EmailVerificationChallenge => {
    const token = randomBytes(EMAIL_VERIFICATION_TOKEN_BYTES).toString('hex');
    const expiresAt = new Date(now.getTime() + getExpiryHours() * 60 * 60 * 1000);

    return {
        token,
        tokenHash: hashVerificationToken(token),
        expiresAt,
        issuedAt: now,
    };
};

export const getVerificationTokenStatus = ({
    suppliedToken,
    storedTokenHash,
    expiresAt,
    emailVerified,
    now = new Date(),
}: {
    suppliedToken: string;
    storedTokenHash?: string;
    expiresAt?: Date;
    emailVerified: boolean;
    now?: Date;
}): VerificationTokenStatus => {
    if (emailVerified) return 'already_verified';
    if (!/^[a-f0-9]{64}$/i.test(suppliedToken) || !storedTokenHash || !expiresAt) {
        return 'invalid';
    }

    const suppliedHash = Buffer.from(hashVerificationToken(suppliedToken), 'hex');
    const storedHash = Buffer.from(storedTokenHash, 'hex');
    if (
        suppliedHash.length !== storedHash.length ||
        !crypto.timingSafeEqual(suppliedHash, storedHash)
    ) {
        return 'invalid';
    }

    return expiresAt.getTime() <= now.getTime() ? 'expired' : 'valid';
};

export const getResendWaitSeconds = (lastSentAt?: Date, now = new Date()) => {
    if (!lastSentAt) return 0;
    const elapsedSeconds = Math.floor((now.getTime() - lastSentAt.getTime()) / 1000);
    return Math.max(0, VERIFICATION_RESEND_COOLDOWN_SECONDS - elapsedSeconds);
};
