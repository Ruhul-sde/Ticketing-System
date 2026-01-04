import nodemailer from 'nodemailer';

/* ======================= ENV DEBUG ======================= */
console.log('📧 EMAIL ENV CHECK:', {
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS_EXISTS: !!process.env.SMTP_PASS
});

/* ======================= TRANSPORTER ======================= */
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // REQUIRED for Office365
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

/* ======================= VERIFY SMTP ======================= */
transporter.verify((err) => {
  if (err) {
    console.error('❌ SMTP VERIFY FAILED:', err.message);
  } else {
    console.log('✅ SMTP CONNECTED (Office365)');
  }
});

/* ======================= TICKET CREATED ======================= */
export const sendTicketCreatedEmail = async (to, ticket) => {
  try {
    if (!to) {
      console.warn('⚠️ Email skipped: recipient missing');
      return;
    }

    const info = await transporter.sendMail({
      from: `"ASTL Ticket System" <${process.env.SMTP_USER}>`,
      to,
      subject: `Ticket Created | ${ticket.ticketNumber}`,
      html: `
        <h2>Thank you for contacting support</h2>
        <p>Your ticket has been created successfully.</p>
        <p><strong>Ticket Number:</strong> ${ticket.ticketNumber}</p>
        <p><strong>Title:</strong> ${ticket.title}</p>
        <p>We will solve your problem as soon as possible.</p>
        <br/>
        <p>Regards,<br/>ASTL Support Team</p>
      `
    });

    console.log('✅ TICKET CREATED EMAIL SENT:', info.messageId);

  } catch (error) {
    console.error('❌ TICKET CREATED EMAIL FAILED:', error.message);
  }
};

/* ======================= TICKET RESOLVED ======================= */
export const sendTicketResolvedEmail = async (to, ticket) => {
  try {
    if (!to) return;

    await transporter.sendMail({
      from: `"ASTL Ticket System" <${process.env.SMTP_USER}>`,
      to,
      subject: `Ticket Resolved | ${ticket.ticketNumber}`,
      html: `
        <h2>Your ticket has been resolved</h2>
        <p><strong>Ticket Number:</strong> ${ticket.ticketNumber}</p>
        <p>Please login to your dashboard for details.</p>
      `
    });

    console.log('✅ TICKET RESOLVED EMAIL SENT');

  } catch (error) {
    console.error('❌ TICKET RESOLVED EMAIL FAILED:', error.message);
  }
};

/* ======================= TOKEN COMPLETED ======================= */
export const sendTokenCompletedEmail = async (to, token) => {
  try {
    if (!to) return;

    await transporter.sendMail({
      from: `"ASTL Ticket System" <${process.env.SMTP_USER}>`,
      to,
      subject: `Token Completed | ${token.ticketNumber}`,
      html: `
        <h2>Your token has been completed</h2>
        <p><strong>Token Number:</strong> ${token.ticketNumber}</p>
        <p>Please login to your dashboard for details.</p>
      `
    });

    console.log('✅ TOKEN COMPLETED EMAIL SENT');

  } catch (error) {
    console.error('❌ TOKEN COMPLETED EMAIL FAILED:', error.message);
  }
};
