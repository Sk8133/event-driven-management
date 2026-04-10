import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendEventNotification = async (event, users) => {
  const subject = `New Event Created: ${event.title}`;
  const html = `
    <h1>New Event Notification</h1>
    <p>A new event has been created:</p>
    <h2>${event.title}</h2>
    <p>${event.description}</p>
    <p>Date: ${new Date(event.date).toLocaleDateString()}</p>
    <p>Please check the dashboard for more details.</p>
  `;

  for (const user of users) {
    await sendEmail(user.email, subject, html);
  }
};