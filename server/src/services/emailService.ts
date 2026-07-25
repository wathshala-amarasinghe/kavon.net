import nodemailer from 'nodemailer';

// ─── Configuration ────────────────────────────────────────────────────────────

const escapeHtml = (value: string) =>
    value.replace(/[&<>"']/g, (c) =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[c] as string
    );

const getEmailConfig = () => {
    const fromAddress = process.env.EMAIL_FROM_ADDRESS?.trim();
    const fromName   = process.env.EMAIL_FROM_NAME?.trim() || 'KAVON';
    const password   = process.env.EMAIL_PASSWORD?.trim() || process.env.SMTP_PASS?.trim();
    const frontendUrl = process.env.FRONTEND_URL?.trim();

    if (!fromAddress) throw new Error('EMAIL_FROM_ADDRESS is not set in environment');
    if (!password)    throw new Error('EMAIL_PASSWORD is not set in environment');
    if (!frontendUrl) throw new Error('FRONTEND_URL is not set in environment');

    // Auto-detect SMTP host from the sender's email domain
    const smtpHost = process.env.SMTP_HOST?.trim() || (() => {
        const domain = fromAddress.split('@')[1]?.toLowerCase() ?? '';
        if (domain.includes('gmail'))   return 'smtp.gmail.com';
        // Personal Outlook.com / Hotmail / Live accounts use smtp-mail.outlook.com
        // Microsoft 365 business accounts use smtp.office365.com
        if (domain === 'outlook.com' ||
            domain === 'hotmail.com'  ||
            domain === 'live.com')       return 'smtp-mail.outlook.com';
        if (domain.includes('outlook') ||
            domain.includes('hotmail') ||
            domain.includes('live'))     return 'smtp.office365.com';
        return `smtp.${domain}`;
    })();

    const smtpPort = Number(process.env.SMTP_PORT) || 587;

    let trustedFrontendUrl: URL;
    try {
        trustedFrontendUrl = new URL(frontendUrl);
    } catch {
        throw new Error('FRONTEND_URL is not a valid URL');
    }

    return { fromAddress, fromName, password, smtpHost, smtpPort, frontendUrl: trustedFrontendUrl };
};

// ─── Transporter (cached per process) ─────────────────────────────────────────

let _transporter: nodemailer.Transporter | null = null;

const getTransporter = () => {
    // Re-create on each startup; cache within a running process for efficiency
    if (_transporter) return _transporter;
    const cfg = getEmailConfig();

    _transporter = nodemailer.createTransport({
        host:   cfg.smtpHost,
        port:   cfg.smtpPort,
        secure: cfg.smtpPort === 465,
        auth: {
            user: cfg.fromAddress,
            pass: cfg.password,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    return _transporter;
};

// ─── Send helpers ──────────────────────────────────────────────────────────────

export const sendVerificationEmail = async ({
    recipientEmail,
    recipientName,
    token,
}: {
    recipientEmail: string;
    recipientName: string;
    token: string;
}) => {
    const cfg = getEmailConfig();
    const verificationUrl = new URL('/verify-email', cfg.frontendUrl);
    verificationUrl.searchParams.set('token', token);

    const safeName           = escapeHtml(recipientName);
    const safeUrl            = escapeHtml(verificationUrl.toString());
    const safeSupportEmail   = escapeHtml(
        process.env.EMAIL_SUPPORT_ADDRESS?.trim() || cfg.fromAddress
    );

    const htmlContent = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Verify your KAVON account</title>
</head>
<body style="margin:0;background:#050505;color:#ffffff;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#050505;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#0d0d0d;border:1px solid #292929;">
        <tr><td style="height:4px;background:#df0715;"></td></tr>
        <tr><td style="padding:42px 34px 20px;text-align:center;">
          <div style="font-size:30px;font-weight:900;letter-spacing:8px;">KAVON</div>
          <div style="margin-top:8px;color:#df0715;font-size:11px;font-weight:700;letter-spacing:3px;">WEAR POWER. WEAR KAVON.</div>
        </td></tr>
        <tr><td style="padding:20px 34px 42px;">
          <h1 style="margin:0 0 18px;font-size:26px;line-height:1.25;">Verify your email</h1>
          <p style="margin:0 0 14px;color:#d6d6d6;font-size:16px;line-height:1.65;">Hi ${safeName},</p>
          <p style="margin:0 0 28px;color:#d6d6d6;font-size:16px;line-height:1.65;">Welcome to KAVON. Verify your email address to secure your account and continue shopping.</p>
          <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto 28px;">
            <tr><td style="background:#df0715;">
              <a href="${safeUrl}" style="display:inline-block;padding:17px 28px;color:#ffffff;text-decoration:none;font-size:13px;font-weight:900;letter-spacing:2px;">VERIFY MY EMAIL</a>
            </td></tr>
          </table>
          <p style="margin:0 0 10px;color:#9f9f9f;font-size:13px;line-height:1.55;">This link expires in 24 hours and can be used only once.</p>
          <p style="margin:0 0 8px;color:#9f9f9f;font-size:13px;line-height:1.55;">If the button does not work, copy this address into your browser:</p>
          <p style="margin:0 0 24px;word-break:break-all;color:#df0715;font-size:12px;line-height:1.55;">${safeUrl}</p>
          <p style="margin:0;color:#777777;font-size:12px;line-height:1.55;">If you did not create a KAVON account, ignore this email. Need help? Contact ${safeSupportEmail}.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const textContent = [
        `Hi ${recipientName},`,
        '',
        'Welcome to KAVON. Verify your email address to secure your account.',
        '',
        verificationUrl.toString(),
        '',
        'This link expires in 24 hours and can be used only once.',
        'If you did not create a KAVON account, ignore this email.',
    ].join('\n');

    const transporter = getTransporter();
    await transporter.sendMail({
        from:    `"${cfg.fromName}" <${cfg.fromAddress}>`,
        to:      `"${recipientName}" <${recipientEmail}>`,
        subject: 'Verify your KAVON account',
        html:    htmlContent,
        text:    textContent,
    });
};

// Fire-and-forget wrapper — registration must succeed even if email fails
export const trySendVerificationEmail = async (
    params: Parameters<typeof sendVerificationEmail>[0]
) => {
    try {
        await sendVerificationEmail(params);
        console.log(`[EMAIL] Verification email sent to ${params.recipientEmail}`);
        return true;
    } catch (error) {
        console.error('[EMAIL] Failed to send verification email:', error);
        return false;
    }
};

// Legacy Brevo-compatible export (keeps other imports working)
export const sendTransactionalEmail = async (_: unknown) => {
    throw new Error('sendTransactionalEmail: use sendVerificationEmail instead');
};
