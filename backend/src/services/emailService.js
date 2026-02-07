const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

/**
 * Creates a nodemailer transporter with environment variables
 * @returns {Object} Configured nodemailer transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'Gmail',
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

let transporter;

/**
 * Compiles and returns an email template with the given context
 * @param {string} templateName - The name of the template file (without extension)
 * @param {Object} context - The context data for the template
 * @returns {string} Compiled HTML content
 */
const compileTemplate = (templateName, context) => {
  try {
    const templatePath = path.join(__dirname, 'templates', `${templateName}.html`);
    
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Email template '${templateName}.html' not found`);
    }

    const source = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(source);
    return template(context);
  } catch (error) {
    console.error(`Template compilation error: ${error.message}`);
    throw error;
  }
};

/**
 * Sends an email using Nodemailer
 * @param {string|string[]} to - Recipient email address(es)
 * @param {string} subject - Email subject
 * @param {string} html - HTML content of the email
 * @returns {Promise<Object>} Send result information
 */
const sendEmailDirectly = async (to, subject, html) => {
  if (!transporter) {
    transporter = createTransporter();
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: Array.isArray(to) ? to.join(', ') : to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId,
      method: 'direct',
    };
  } catch (error) {
    console.error(`❌ Error sending email to ${to}: ${error.message}`);
    throw error;
  }
};

/**
 * Main function to send emails with template support
 * @param {string|string[]} to - Recipient email address(es)
 * @param {string} subject - Email subject
 * @param {string} templateName - Name of the template file (without .html extension)
 * @param {Object} context - Data to be used in the template
 * @returns {Promise<Object>} Send result information
 */
const sendEmail = async (to, subject, templateName, context = {}) => {
  try {
    if (!to) {
      throw new Error('Recipient email is required');
    }

    if (!templateName) {
      throw new Error('Template name is required');
    }

    // Compile the template
    const html = compileTemplate(templateName, context);

    // Send the email directly
    const result = await sendEmailDirectly(to, subject, html);
    
    return result;
  } catch (error) {
    console.error(`Email sending failed: ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Specific email functions for common use cases
 */

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;
  
  return await sendEmail(
    email,
    'Reset Your Password - iCog Sync',
    'password-reset',
    {
      name: 'User', // You might want to fetch user's name from DB
      resetUrl,
      expiryTime: '10 minutes',
      supportEmail: process.env.SUPPORT_EMAIL || 'support@icogsync.com'
    }
  );
};

const sendWelcomeEmail = async (email, name) => {
  return await sendEmail(
    email,
    'Welcome to iCog Sync!',
    'welcome',
    {
      name,
      loginUrl: `${process.env.FRONTEND_URL}/login`,
      supportEmail: process.env.SUPPORT_EMAIL || 'support@icogsync.com'
    }
  );
};

const sendMeetingInviteEmail = async (email, meetingDetails) => {
  return await sendEmail(
    email,
    `Meeting Invitation: ${meetingDetails.title}`,
    'meeting-invite',
    {
      name: meetingDetails.attendeeName,
      meetingTitle: meetingDetails.title,
      meetingDate: meetingDetails.date,
      meetingTime: meetingDetails.time,
      organizer: meetingDetails.organizer,
      meetingUrl: meetingDetails.url,
      agenda: meetingDetails.agenda
    }
  );
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendMeetingInviteEmail,
  createTransporter, // Export for testing
};