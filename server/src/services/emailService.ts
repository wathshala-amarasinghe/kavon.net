import nodemailer from 'nodemailer';
import QRCode from 'qrcode';

// ─── Configuration ────────────────────────────────────────────────────────────

const escapeHtml = (value: string) =>
    value.replace(/[&<>"']/g, (c) =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[c] as string
    );

const getEmailConfig = () => {
    const fromAddress = process.env.EMAIL_FROM_ADDRESS?.trim();
    const fromName   = process.env.EMAIL_FROM_NAME?.trim() || 'KAVON';
    const password   = process.env.EMAIL_PASSWORD?.trim() || process.env.SMTP_PASS?.trim();
    const frontendUrl = process.env.FRONTEND_URL?.trim() || 'http://localhost:3000'; // Default to localhost

    if (!fromAddress) throw new Error('EMAIL_FROM_ADDRESS is not set in environment');
    if (!password)    throw new Error('EMAIL_PASSWORD is not set in environment');
    if (!frontendUrl) throw new Error('FRONTEND_URL is not set in environment');

    // Auto-detect SMTP host from the sender's email domain
    const smtpHost = process.env.SMTP_HOST?.trim() || (() => {
        const domain = fromAddress.split('@')[1]?.toLowerCase() ?? '';
        if (domain.includes('gmail'))   return 'smtp.gmail.com';
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

// ─── Base Template ─────────────────────────────────────────────────────────────

interface EmailTemplateOptions {
    title: string;
    preheader?: string;
    contentHtml: string;
    showUnsubscribe?: boolean;
}

const generateKavonEmailHtml = ({ title, preheader, contentHtml, showUnsubscribe = false }: EmailTemplateOptions) => {
    const cfg = getEmailConfig();
    const safeSupportEmail = escapeHtml(process.env.EMAIL_SUPPORT_ADDRESS?.trim() || cfg.fromAddress);
    const safePreheader = escapeHtml(preheader || title);
    
    // Create Unsubscribe Link pointing to local server settings
    const unsubscribeUrl = new URL('/dashboard?tab=settings', cfg.frontendUrl).toString();

    return `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #050505; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    table { border-spacing: 0; border-collapse: collapse; }
    td { padding: 0; }
    a { color: #df0715; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #0d0d0d; border: 1px solid #292929; }
    .header { padding: 42px 34px 20px; text-align: center; }
    .logo { font-size: 30px; font-weight: 900; letter-spacing: 8px; color: #ffffff; margin: 0; }
    .tagline { margin-top: 8px; color: #df0715; font-size: 11px; font-weight: 700; letter-spacing: 3px; }
    .content { padding: 20px 34px 42px; }
    .footer { padding: 20px 34px; text-align: center; border-top: 1px solid #1a1a1a; }
    .footer-text { margin: 0; color: #777777; font-size: 11px; line-height: 1.6; }
    .btn { display: inline-block; padding: 16px 28px; background-color: #df0715; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; }
    .btn:hover { background-color: #ff0818; text-decoration: none; }
    .btn-container { margin: 32px 0; text-align: center; }
  </style>
</head>
<body>
  <!-- Preheader text for email clients -->
  <div style="display:none;font-size:1px;color:#050505;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${safePreheader}
  </div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#050505;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" class="container">
        <tr><td style="height:4px;background:#df0715;"></td></tr>
        <tr>
          <td class="header">
            <div class="logo">KAVON</div>
            <div class="tagline">WEAR POWER. WEAR KAVON.</div>
          </td>
        </tr>
        <tr>
          <td class="content">
            ${contentHtml}
          </td>
        </tr>
        <tr>
          <td class="footer">
            <p class="footer-text">Need help? Contact <a href="mailto:${safeSupportEmail}" style="color:#df0715;">${safeSupportEmail}</a>.</p>
            ${showUnsubscribe ? `<p class="footer-text" style="margin-top:10px;"><a href="${unsubscribeUrl}" style="color:#555555;text-decoration:underline;">Unsubscribe from marketing emails</a></p>` : ''}
            <p class="footer-text" style="margin-top:16px;">© ${new Date().getFullYear()} KAVON. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
};

// ─── Email Dispatcher ────────────────────────────────────────────────────────

const dispatchEmail = async (toEmail: string, toName: string, subject: string, htmlContent: string, textContent: string) => {
    const cfg = getEmailConfig();
    const transporter = getTransporter();
    
    await transporter.sendMail({
        from:    `"${cfg.fromName}" <${cfg.fromAddress}>`,
        to:      `"${toName}" <${toEmail}>`,
        subject,
        html:    htmlContent,
        text:    textContent,
    });
};

// ─── 1. Verification Email ───────────────────────────────────────────────────

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

    const safeName = escapeHtml(recipientName);
    const safeUrl  = escapeHtml(verificationUrl.toString());

    const contentHtml = `
        <h1 style="margin:0 0 18px;font-size:24px;line-height:1.25;text-transform:uppercase;font-style:italic;font-weight:900;">Verify your identity</h1>
        <p style="margin:0 0 16px;color:#d6d6d6;font-size:15px;line-height:1.65;">Initiate sequence for Operative ${safeName},</p>
        <p style="margin:0 0 24px;color:#d6d6d6;font-size:15px;line-height:1.65;">Welcome to the network. Secure your credentials by verifying this transmission endpoint.</p>
        
        <div class="btn-container">
            <a href="${safeUrl}" class="btn">VERIFY CONNECTION</a>
        </div>
        
        <p style="margin:0 0 10px;color:#9f9f9f;font-size:12px;line-height:1.55;">This secure link expires in 24 hours.</p>
        <p style="margin:0 0 8px;color:#9f9f9f;font-size:12px;line-height:1.55;">If the button fails, manually input this sequence:</p>
        <p style="margin:0 0 0;word-break:break-all;color:#df0715;font-size:11px;line-height:1.55;font-family:monospace;">${safeUrl}</p>
    `;

    const html = generateKavonEmailHtml({
        title: 'Verify your KAVON account',
        preheader: 'Secure your credentials by verifying your email address.',
        contentHtml
    });

    const textContent = `Initiate sequence for Operative ${recipientName},\n\nVerify your email address here:\n${verificationUrl.toString()}`;

    await dispatchEmail(recipientEmail, recipientName, 'Verify your KAVON account', html, textContent);
};

// Fire-and-forget wrapper
export const trySendVerificationEmail = async (params: Parameters<typeof sendVerificationEmail>[0]) => {
    try {
        await sendVerificationEmail(params);
        console.log(`[EMAIL] Verification email sent to ${params.recipientEmail}`);
        return true;
    } catch (error) {
        console.error('[EMAIL] Failed to send verification email:', error);
        return false;
    }
};

// ─── 2. Verification Successful ──────────────────────────────────────────────

export const sendVerificationSuccessfulEmail = async (recipientEmail: string, recipientName: string) => {
    const safeName = escapeHtml(recipientName);
    const contentHtml = `
        <h1 style="margin:0 0 18px;font-size:24px;line-height:1.25;text-transform:uppercase;font-style:italic;font-weight:900;">Identity Confirmed</h1>
        <p style="margin:0 0 16px;color:#d6d6d6;font-size:15px;line-height:1.65;">Operative ${safeName},</p>
        <p style="margin:0 0 24px;color:#d6d6d6;font-size:15px;line-height:1.65;">Your email endpoint has been successfully verified. Your account is fully activated.</p>
        <div class="btn-container">
            <a href="${getEmailConfig().frontendUrl}/login" class="btn">ACCESS DASHBOARD</a>
        </div>
    `;
    const html = generateKavonEmailHtml({ title: 'Welcome to KAVON', contentHtml });
    await dispatchEmail(recipientEmail, recipientName, 'Account Verified', html, `Identity Confirmed, ${recipientName}.`);
};

// ─── 3. Order Confirmation ───────────────────────────────────────────────────

export const sendOrderConfirmationEmail = async (email: string, name: string, order: any) => {
    let qrCodeDataUrl = '';
    try {
        qrCodeDataUrl = await QRCode.toDataURL(order._id.toString(), {
            color: { dark: '#df0715', light: '#050505' },
            width: 150,
            margin: 1
        });
    } catch (e) {
        console.error('Failed to generate QR code for email', e);
    }

    const itemsHtml = order.orderItems.map((item: any) => `
        <div style="display:flex;padding:16px 0;border-bottom:1px solid #1a1a1a;">
            <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" style="width:70px;height:70px;object-fit:cover;border:1px solid #292929;background:#000;">
            <div style="margin-left:16px;flex:1;">
                <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#fff;">${escapeHtml(item.name)}</p>
                <p style="margin:0 0 4px;font-size:12px;color:#999;">Size: ${escapeHtml(item.size)} | Color: ${escapeHtml(item.color)}</p>
                <p style="margin:0;font-size:12px;color:#df0715;font-weight:700;">Qty: ${item.quantity} × $${Number(item.price).toFixed(2)}</p>
            </div>
        </div>
    `).join('');

    const contentHtml = `
        <h1 style="margin:0 0 18px;font-size:24px;line-height:1.25;text-transform:uppercase;font-style:italic;font-weight:900;">Acquisition Confirmed</h1>
        <p style="margin:0 0 16px;color:#d6d6d6;font-size:15px;line-height:1.65;">Operative ${escapeHtml(name)},</p>
        <p style="margin:0 0 24px;color:#d6d6d6;font-size:15px;line-height:1.65;">Your order <strong style="color:#fff;">#${escapeHtml(order._id.toString())}</strong> has been successfully processed and is preparing for deployment.</p>
        
        <div style="background:#0d0d0d;border:1px solid #292929;padding:24px;margin-bottom:24px;">
            <div style="display:flex;justify-content:space-between;border-bottom:1px solid #1a1a1a;padding-bottom:16px;margin-bottom:16px;">
                <div style="width: 60%;">
                    <p style="margin:0 0 8px;font-size:11px;color:#df0715;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Deployment Logistics</p>
                    <p style="margin:0 0 4px;font-size:13px;color:#fff;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                    <p style="margin:0 0 4px;font-size:13px;color:#fff;"><strong>Method:</strong> ${escapeHtml(order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card')}</p>
                    <p style="margin:0 0 4px;font-size:13px;color:#fff;"><strong>Status:</strong> <span style="color:#df0715;">${escapeHtml(order.status)}</span></p>
                    <p style="margin:0 0 4px;font-size:13px;color:#fff;"><strong>Delivery:</strong> ${escapeHtml(order.deliveryMethod.toUpperCase())}</p>
                </div>
                <div style="text-align:right;">
                    ${qrCodeDataUrl ? `<img src="${qrCodeDataUrl}" alt="Order QR" style="width:80px;height:80px;border:1px solid #df0715;padding:4px;background:#000;">` : ''}
                </div>
            </div>
            
            <p style="margin:0 0 8px;font-size:11px;color:#df0715;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Destination Coordinates</p>
            <p style="margin:0 0 16px;font-size:13px;color:#ccc;line-height:1.5;">
                ${escapeHtml(order.shippingAddress.address)}<br/>
                ${escapeHtml(order.shippingAddress.city)}, ${escapeHtml(order.shippingAddress.postalCode)}<br/>
                ${escapeHtml(order.shippingAddress.country)}
            </p>

            <p style="margin:0 0 8px;font-size:11px;color:#df0715;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Acquired Assets</p>
            <div style="margin-bottom:16px;border-top:1px solid #1a1a1a;">
                ${itemsHtml}
            </div>

            <table width="100%" cellspacing="0" cellpadding="0" style="font-size:13px;color:#ccc;margin-bottom:8px;">
                <tr><td style="padding:4px 0;">Subtotal</td><td align="right" style="color:#fff;">$${Number(order.itemsPrice).toFixed(2)}</td></tr>
                <tr><td style="padding:4px 0;">Discount</td><td align="right" style="color:#df0715;">-$${Number(order.discountPrice).toFixed(2)}</td></tr>
                <tr><td style="padding:4px 0;">Delivery Fee</td><td align="right" style="color:#fff;">$${Number(order.shippingPrice).toFixed(2)}</td></tr>
            </table>
            <div style="border-top:1px dashed #292929;padding-top:12px;display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:14px;color:#fff;font-weight:700;">TOTAL AUTHORIZED</span>
                <span style="font-size:24px;color:#df0715;font-weight:900;font-style:italic;">$${Number(order.totalPrice).toFixed(2)}</span>
            </div>
        </div>
        
        <div class="btn-container">
            <a href="${getEmailConfig().frontendUrl}/order/${order._id.toString()}" class="btn">VIEW MY ORDER</a>
        </div>
    `;
    const html = generateKavonEmailHtml({ title: 'Order Confirmation', preheader: `Order #${order._id.toString()} received`, contentHtml });
    await dispatchEmail(email, name, `Order Received: #${order._id.toString()}`, html, `Order #${order._id.toString()} confirmed for $${Number(order.totalPrice).toFixed(2)}`);
};

// ─── 4. Order Status Updated ─────────────────────────────────────────────────

export const sendOrderStatusUpdatedEmail = async (email: string, name: string, orderId: string, status: string) => {
    const contentHtml = `
        <h1 style="margin:0 0 18px;font-size:24px;line-height:1.25;text-transform:uppercase;font-style:italic;font-weight:900;">Status Update</h1>
        <p style="margin:0 0 16px;color:#d6d6d6;font-size:15px;line-height:1.65;">Order <strong style="color:#fff;">#${escapeHtml(orderId)}</strong> has been updated.</p>
        <p style="margin:0 0 24px;color:#d6d6d6;font-size:15px;line-height:1.65;">New Status: <span style="color:#df0715;font-weight:bold;text-transform:uppercase;">${escapeHtml(status)}</span></p>
    `;
    const html = generateKavonEmailHtml({ title: 'Order Update', contentHtml });
    await dispatchEmail(email, name, `Order Update: #${orderId}`, html, `Order #${orderId} status is now: ${status}`);
};

// ─── 5. Order Shipped ────────────────────────────────────────────────────────

export const sendOrderShippedEmail = async (email: string, name: string, orderId: string, trackingInfo: string) => {
    const contentHtml = `
        <h1 style="margin:0 0 18px;font-size:24px;line-height:1.25;text-transform:uppercase;font-style:italic;font-weight:900;">Assets Dispatched</h1>
        <p style="margin:0 0 16px;color:#d6d6d6;font-size:15px;line-height:1.65;">Order <strong style="color:#fff;">#${escapeHtml(orderId)}</strong> is in transit.</p>
        <div style="background:#111;padding:20px;border:1px solid #222;margin-bottom:24px;">
            <p style="margin:0 0 10px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:1px;">Tracking Information</p>
            <p style="margin:0;font-size:14px;color:#fff;font-family:monospace;">${escapeHtml(trackingInfo)}</p>
        </div>
    `;
    const html = generateKavonEmailHtml({ title: 'Order Shipped', contentHtml });
    await dispatchEmail(email, name, `Order Shipped: #${orderId}`, html, `Order #${orderId} has shipped. Tracking: ${trackingInfo}`);
};

// ─── 6. Order Delivered ──────────────────────────────────────────────────────

export const sendOrderDeliveredEmail = async (email: string, name: string, orderId: string) => {
    const contentHtml = `
        <h1 style="margin:0 0 18px;font-size:24px;line-height:1.25;text-transform:uppercase;font-style:italic;font-weight:900;">Mission Complete</h1>
        <p style="margin:0 0 16px;color:#d6d6d6;font-size:15px;line-height:1.65;">Operative ${escapeHtml(name)},</p>
        <p style="margin:0 0 24px;color:#d6d6d6;font-size:15px;line-height:1.65;">Order <strong style="color:#fff;">#${escapeHtml(orderId)}</strong> has been delivered.</p>
    `;
    const html = generateKavonEmailHtml({ title: 'Order Delivered', contentHtml });
    await dispatchEmail(email, name, `Order Delivered: #${orderId}`, html, `Order #${orderId} has been delivered.`);
};

// ─── 7. Order Cancelled / Refunded ───────────────────────────────────────────

export const sendOrderCancelledRefundedEmail = async (email: string, name: string, orderId: string, amount: number) => {
    const contentHtml = `
        <h1 style="margin:0 0 18px;font-size:24px;line-height:1.25;text-transform:uppercase;font-style:italic;font-weight:900;">Operation Aborted</h1>
        <p style="margin:0 0 16px;color:#d6d6d6;font-size:15px;line-height:1.65;">Order <strong style="color:#fff;">#${escapeHtml(orderId)}</strong> has been cancelled.</p>
        <p style="margin:0 0 24px;color:#d6d6d6;font-size:15px;line-height:1.65;">A refund of <span style="color:#df0715;font-weight:bold;">$${amount.toFixed(2)}</span> has been issued to your original payment method.</p>
    `;
    const html = generateKavonEmailHtml({ title: 'Order Cancelled', contentHtml });
    await dispatchEmail(email, name, `Order Cancelled: #${orderId}`, html, `Order #${orderId} has been cancelled and $${amount.toFixed(2)} refunded.`);
};

// ─── 8. New Offer / Collection ───────────────────────────────────────────────

export const sendNewOfferEmail = async (email: string, name: string, title: string, detailsHtml: string, link: string) => {
    const contentHtml = `
        <h1 style="margin:0 0 18px;font-size:24px;line-height:1.25;text-transform:uppercase;font-style:italic;font-weight:900;">${escapeHtml(title)}</h1>
        <div style="margin:0 0 24px;color:#d6d6d6;font-size:15px;line-height:1.65;">
            ${detailsHtml}
        </div>
        <div class="btn-container">
            <a href="${escapeHtml(link)}" class="btn">VIEW INTEL</a>
        </div>
    `;
    const html = generateKavonEmailHtml({ title, preheader: 'New transmission from KAVON', contentHtml, showUnsubscribe: true });
    await dispatchEmail(email, name, title, html, `New offer: ${title}\nView here: ${link}`);
};

// ─── 9. Maintenance Announcement ─────────────────────────────────────────────

export const sendMaintenanceAnnouncementEmail = async (email: string, name: string, date: string, details: string) => {
    const contentHtml = `
        <h1 style="margin:0 0 18px;font-size:24px;line-height:1.25;text-transform:uppercase;font-style:italic;font-weight:900;">System Maintenance</h1>
        <p style="margin:0 0 16px;color:#d6d6d6;font-size:15px;line-height:1.65;">Scheduled maintenance will occur on <strong style="color:#fff;">${escapeHtml(date)}</strong>.</p>
        <div style="background:#111;padding:20px;border:1px solid #222;margin-bottom:24px;color:#999;font-size:13px;line-height:1.5;">
            ${escapeHtml(details)}
        </div>
    `;
    const html = generateKavonEmailHtml({ title: 'Scheduled Maintenance', contentHtml });
    await dispatchEmail(email, name, 'Scheduled Maintenance Notice', html, `Maintenance on ${date}. ${details}`);
};

// ─── 10. Security Alert ──────────────────────────────────────────────────────

export const sendSecurityAlertEmail = async (email: string, name: string, message: string) => {
    const contentHtml = `
        <h1 style="margin:0 0 18px;font-size:24px;line-height:1.25;text-transform:uppercase;font-style:italic;font-weight:900;color:#df0715;">Security Alert</h1>
        <p style="margin:0 0 16px;color:#d6d6d6;font-size:15px;line-height:1.65;">Operative ${escapeHtml(name)},</p>
        <div style="background:rgba(223,7,21,0.1);padding:20px;border:1px solid rgba(223,7,21,0.3);margin-bottom:24px;color:#fff;font-size:14px;">
            ${escapeHtml(message)}
        </div>
        <p style="margin:0 0 24px;color:#999;font-size:13px;line-height:1.55;">If you did not initiate this action, please contact support immediately.</p>
    `;
    const html = generateKavonEmailHtml({ title: 'Security Alert', contentHtml });
    await dispatchEmail(email, name, 'KAVON Security Alert', html, `Security Alert: ${message}`);
};

// ─── 11. Test Email (Admin) ──────────────────────────────────────────────────

export const sendTestEmail = async (adminEmail: string) => {
    const contentHtml = `
        <h1 style="margin:0 0 18px;font-size:24px;line-height:1.25;text-transform:uppercase;font-style:italic;font-weight:900;">Test Transmission</h1>
        <p style="margin:0 0 16px;color:#d6d6d6;font-size:15px;line-height:1.65;">System diagnostic email.</p>
        <p style="margin:0 0 24px;color:#d6d6d6;font-size:15px;line-height:1.65;">If you received this, the SMTP relay is functioning correctly.</p>
    `;
    const html = generateKavonEmailHtml({ title: 'Test Email', contentHtml });
    await dispatchEmail(adminEmail, 'Administrator', 'KAVON System Test', html, 'System diagnostic email working correctly.');
};

// Legacy Brevo-compatible export (keeps other imports working temporarily)
export const sendTransactionalEmail = async (_: unknown) => {
    throw new Error('sendTransactionalEmail: use specific template functions instead');
};
