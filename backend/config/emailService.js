import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ override: true });

/**
 * EMAIL SERVICE CONFIGURATION
 * Uses Brevo SMTP for sending emails
 * Highly reliable on cloud platforms
 */

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Add connection timeout and retry options for better reliability
    connectionTimeout: 30000, // 30 seconds
    greetingTimeout: 15000,   // 15 seconds
    socketTimeout: 30000,     // 30 seconds
  });
};

// Use SendGrid transporter
let transporter = createTransporter();

/**
 * Send email to registered students using SendGrid SMTP
 * @param {Array} studentEmails - Array of student email addresses
 * @param {String} subject - Email subject
 * @param {String} htmlContent - Email HTML content
 */
export const sendEmailToStudents = async (studentEmails, subject, htmlContent, retryCount = 0) => {
  if (!studentEmails || studentEmails.length === 0) {
    console.log('No student emails to send to');
    return;
  }

  const maxRetries = 3;
  const retryDelay = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s

  try {
    const mailOptions = {
      from: `"Event Management System" <${process.env.FROM_EMAIL || 'noreply@yourdomain.com'}>`, // Use verified sender email
      to: studentEmails.join(','),
      subject: subject,
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${studentEmails.length} students:`, result.messageId);
    return result;
  } catch (error) {
    console.error(`Error sending email (attempt ${retryCount + 1}/${maxRetries + 1}):`, error.message);

    // Retry logic for connection timeouts
    if (retryCount < maxRetries && (error.code === 'ETIMEDOUT' || error.code === 'ECONNRESET' || error.code === 'ENOTFOUND')) {
      console.log(`Retrying email send in ${retryDelay}ms...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return sendEmailToStudents(studentEmails, subject, htmlContent, retryCount + 1);
    }

    // Don't throw error - just log it to prevent server crashes
    console.error('Email sending failed after all retries');
    return null;
  }
};

/**
 * Email template for event creation
 */
export const eventCreationEmailTemplate = (eventTitle, eventDescription, eventDate, eventLocation) => {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #0066cc;">New Event Created!</h2>
      <p>Hi Students,</p>
      <p>A new event has been created. Here are the details:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Event Title:</strong> ${eventTitle}</p>
        <p><strong>Description:</strong> ${eventDescription}</p>
        <p><strong>Date:</strong> ${new Date(eventDate).toLocaleString()}</p>
        <p><strong>Location:</strong> ${eventLocation}</p>
      </div>
      <p>Please check the application for more details and to register if interested.</p>
      <p>Best regards,<br>Event Management Team</p>
    </div>
  `;
};

/**
 * Email template for task creation
 */
export const taskCreationEmailTemplate = (taskTitle, taskDescription, deadline) => {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #ff6600;">New Task Assigned!</h2>
      <p>Hi Students,</p>
      <p>A new task has been created for an event. Here are the details:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Task Title:</strong> ${taskTitle}</p>
        <p><strong>Description:</strong> ${taskDescription}</p>
        <p><strong>Deadline:</strong> ${deadline || 'Not specified'}</p>
      </div>
      <p>Please check the application for more details and to accept the task if applicable.</p>
      <p>Best regards,<br>Event Management Team</p>
    </div>
  `;
};

/**
 * Email template for media upload
 */
export const mediaUploadEmailTemplate = (eventTitle, mediaType, mediaCount) => {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #00cc66;">New Media Added to Event!</h2>
      <p>Hi Students,</p>
      <p>New ${mediaType.toLowerCase()} have been added to an event. Check them out!</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Event:</strong> ${eventTitle}</p>
        <p><strong>Media Type:</strong> ${mediaType}</p>
        <p><strong>Count:</strong> ${mediaCount} new ${mediaType.toLowerCase()}</p>
      </div>
      <p>Please check the application to view the media.</p>
      <p>Best regards,<br>Event Management Team</p>
    </div>
  `;
};

export default transporter;
