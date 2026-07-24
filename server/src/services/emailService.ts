const BREVO_TRANSACTIONAL_EMAIL_URL = 'https://api.brevo.com/v3/smtp/email';

interface TransactionalEmail {
    to: { email: string; name?: string }[];
    subject: string;
    htmlContent: string;
    textContent: string;
}

type FetchImplementation = typeof fetch;

const escapeHtml = (value: string) =>
    value.replace(
        /[&<>"']/g,
        (character) =>
            ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;',
            })[character] as string
    );

const getEmailConfiguration = () => {
    const apiKey = process.env.BREVO_API_KEY?.trim();
    const fromName = process.env.EMAIL_FROM_NAME?.trim() || 'KAVON';
    const fromAddress = process.env.EMAIL_FROM_ADDRESS?.trim();
    const frontendUrl = process.env.FRONTEND_URL?.trim();

    if (!apiKey || !fromAddress || !frontendUrl) {
        throw new Error('Transactional email service is not configured');
    }

    let trustedFrontendUrl: URL;
    try {
        trustedFrontendUrl = new URL(frontendUrl);
    } catch {
        throw new Error('FRONTEND_URL is invalid');
    }

    if (!['https:', 'http:'].includes(trustedFrontendUrl.protocol)) {
        throw new Error('FRONTEND_URL must use HTTP or HTTPS');
    }

    return {
        apiKey,
        fromName,
        fromAddress,
        frontendUrl: trustedFrontendUrl,
    };
};
export const sendTransactionalEmail = async (
    email: TransactionalEmail,
    fetchImplementation: FetchImplementation = fetch
) => {
    const configuration = getEmailConfiguration();
    const response = await fetchImplementation(BREVO_TRANSACTIONAL_EMAIL_URL, {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'api-key': configuration.apiKey,
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            sender: {
                name: configuration.fromName,
                email: configuration.fromAddress,
            },
            replyTo: {
                name: configuration.fromName,
                email: configuration.fromAddress,
            },
            ...email,
        }),
    });

    if (!response.ok) {
        throw new Error(`Transactional email provider rejected the request (${response.status})`);
    }
};

export const sendVerificationEmail = async ({
    recipientEmail,
    recipientName,
    token,
    fetchImplementation,
}: {
    recipientEmail: string;
    recipientName: string;
    token: string;
    fetchImplementation?: FetchImplementation;
}) => {
    const configuration = getEmailConfiguration();
    const verificationUrl = new URL('/verify-email', configuration.frontendUrl);
    verificationUrl.searchParams.set('token', token);

    const safeName = escapeHtml(recipientName);
    const safeVerificationUrl = escapeHtml(verificationUrl.toString());
    const safeSupportEmail = escapeHtml(
        process.env.EMAIL_SUPPORT_ADDRESS?.trim() || configuration.fromAddress
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
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#0d0d0d;border:1px solid #292929;">
          <tr><td style="height:4px;background:#df0715;"></td></tr>
          <tr>
            <td style="padding:42px 34px 20px;text-align:center;">
              <div style="font-size:30px;font-weight:900;letter-spacing:8px;">KAVON</div>
              <div style="margin-top:8px;color:#df0715;font-size:11px;font-weight:700;letter-spacing:3px;">WEAR POWER. WEAR KAVON.</div>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 34px 42px;">
              <h1 style="margin:0 0 18px;font-size:26px;line-height:1.25;">Verify your email</h1>
              <p style="margin:0 0 14px;color:#d6d6d6;font-size:16px;line-height:1.65;">Hi ${safeName},</p>
              <p style="margin:0 0 28px;color:#d6d6d6;font-size:16px;line-height:1.65;">Welcome to KAVON. Verify your email address to secure your account and continue shopping.</p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto 28px;">
                <tr>
                  <td style="background:#df0715;">
                    <a href="${safeVerificationUrl}" style="display:inline-block;padding:17px 28px;color:#ffffff;text-decoration:none;font-size:13px;font-weight:900;letter-spacing:2px;">VERIFY MY EMAIL</a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 10px;color:#9f9f9f;font-size:13px;line-height:1.55;">This link expires in 24 hours and can be used only once.</p>
              <p style="margin:0 0 8px;color:#9f9f9f;font-size:13px;line-height:1.55;">If the button does not work, copy this address into your browser:</p>
              <p style="margin:0 0 24px;word-break:break-all;color:#df0715;font-size:12px;line-height:1.55;">${safeVerificationUrl}</p>
              <p style="margin:0;color:#777777;font-size:12px;line-height:1.55;">If you did not create a KAVON account, ignore this email. Need help? Contact ${safeSupportEmail}.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const textContent = [
        `Hi ${recipientName},`,
        '',
        'Welcome to KAVON. Verify your email address to secure your account and continue shopping.',
        '',
        verificationUrl.toString(),
        '',
        'This link expires in 24 hours and can be used only once.',
        'If you did not create a KAVON account, ignore this email.',
    ].join('\n');

    await sendTransactionalEmail(
        {
            to: [{ email: recipientEmail, name: recipientName }],
            subject: 'Verify your KAVON account',
            htmlContent,
            textContent,
        },
        fetchImplementation
    );
};

export const trySendVerificationEmail = async (
    parameters: Parameters<typeof sendVerificationEmail>[0]
) => {
    try {
        await sendVerificationEmail(parameters);
        return true;
    } catch {
        // Registration must remain successful when the provider is temporarily
        // unavailable. The customer can request a fresh verification email.
        return false;
    }
};
