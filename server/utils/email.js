
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendEmailNotification = async (to, token, customOptions = {}) => {
  try {
    if (!process.env.SMTP_USER) {
      console.log('Email notification skipped - SMTP not configured');
      return;
    }

    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      ...customOptions
    };

    // Default email for admin notification if no custom options provided
    if (!customOptions.subject && token) {
      mailOptions.subject = `New Token Created: ${token.title}`;
      mailOptions.html = `
        <h2>New Token Alert</h2>
        <p><strong>Title:</strong> ${token.title}</p>
        <p><strong>Description:</strong> ${token.description}</p>
        <p><strong>Priority:</strong> ${token.priority}</p>
        <p><strong>Created At:</strong> ${token.createdAt}</p>
      `;
    }

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};

export const sendTokenCreatedEmail = async (userEmail, token) => {
  const subject = `Token Created: ${token.tokenNumber}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ED1B2F;">Token Created Successfully</h2>
      <p>Dear User,</p>
      <p>Your support token has been created successfully. Here are the details:</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Token Number:</strong> ${token.tokenNumber}</p>
        <p><strong>Title:</strong> ${token.title}</p>
        <p><strong>Description:</strong> ${token.description}</p>
        <p><strong>Priority:</strong> <span style="text-transform: uppercase; color: ${
          token.priority === 'high' ? '#ED1B2F' : token.priority === 'medium' ? '#FFA500' : '#4CAF50'
        };">${token.priority}</span></p>
        <p><strong>Status:</strong> ${token.status}</p>
        <p><strong>Created At:</strong> ${new Date(token.createdAt).toLocaleString()}</p>
        ${token.department ? `<p><strong>Department:</strong> ${token.department.name || 'Unassigned'}</p>` : ''}
      </div>
      
      <p>Our team will review your token and get back to you as soon as possible.</p>
      <p>You can track the progress of your token in your dashboard.</p>
      
      <p>Best regards,<br>Support Team</p>
    </div>
  `;

  await sendEmailNotification(userEmail, null, { subject, html });
};

export const sendTokenCompletedEmail = async (userEmail, token) => {
  const subject = `Token Resolved: ${token.tokenNumber} - Please Review`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4CAF50;">Your Token Has Been Resolved!</h2>
      <p>Dear User,</p>
      <p>Great news! Your support token has been resolved by our team.</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Token Number:</strong> ${token.tokenNumber}</p>
        <p><strong>Title:</strong> ${token.title}</p>
        <p><strong>Resolved By:</strong> ${token.solvedBy?.name || 'Admin'}</p>
        <p><strong>Resolved At:</strong> ${new Date(token.solvedAt).toLocaleString()}</p>
        ${token.solution ? `
          <div style="margin-top: 15px;">
            <p><strong>Solution:</strong></p>
            <p style="background-color: white; padding: 15px; border-left: 4px solid #4CAF50; margin-top: 5px;">
              ${token.solution}
            </p>
          </div>
        ` : ''}
      </div>
      
      <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #FFA500; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #856404;">We Value Your Feedback!</h3>
        <p>Please take a moment to review the resolution and rate your experience.</p>
        <p>Your feedback helps us improve our service quality.</p>
        <p style="margin-top: 15px;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard" 
             style="display: inline-block; background-color: #ED1B2F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Leave Feedback
          </a>
        </p>
      </div>
      
      <p>If you have any questions or concerns about the resolution, please don't hesitate to contact us.</p>
      
      <p>Best regards,<br>Support Team</p>
    </div>
  `;

  await sendEmailNotification(userEmail, null, { subject, html });
};
