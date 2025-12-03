const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  // Check if email config exists
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('Email configuration missing. Please set SMTP_USER and SMTP_PASS in .env file');
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // Your email
      pass: process.env.SMTP_PASS  // Your email password or app password
    }
  });
};

// Send welcome email with password
exports.sendWelcomeEmail = async (email, name, password) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Najah Tutors" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Welcome to Najah Tutors - Your Login Credentials',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .credentials { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .password-box { background: #f0f0f0; padding: 15px; border-radius: 5px; font-size: 18px; font-weight: bold; text-align: center; color: #667eea; margin: 10px 0; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Najah Tutors!</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>Thank you for enrolling in our live online classes. Your account has been created successfully!</p>
              
              <div class="credentials">
                <h3>Your Login Credentials:</h3>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Password:</strong></p>
                <div class="password-box">${password}</div>
                <p style="color: #d32f2f; font-weight: bold;">⚠️ Please save this password securely. You can change it after logging in.</p>
              </div>

              <p>You can now login to your account using the credentials above.</p>
              
              <div style="text-align: center;">
                <a href="file:///C:/Users/DELL/OneDrive/Desktop/najah/najah-frontend/login.html" class="button">Login Now</a>
              </div>

              <p>If you have any questions, please don't hesitate to contact us.</p>
              
              <p>Best regards,<br><strong>Najah Tutors Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this email.</p>
              <p>&copy; ${new Date().getFullYear()} Najah Tutors. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Verify connection
    await transporter.verify();
    console.log('SMTP server is ready to send emails');

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    console.log('Email sent to:', email);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('=== EMAIL ERROR ===');
    console.error('Error sending email:', error.message);
    console.error('Error code:', error.code);
    console.error('Error response:', error.response);
    console.error('Full error:', error);
    console.error('==================');
    throw error;
  }
};

// Send password reset reminder email (7-day window)
exports.sendResetReminderEmail = async (email, name) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Najah Tutors" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Important: Please reset your Najah Tutors password within 7 days',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 24px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 24px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 24px; color: #666; font-size: 12px; }
            .warning { color: #c53030; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Action Needed: Reset Your Password</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>You're currently using a system-generated password for your Najah Tutors account.</p>
              <p class="warning">For your security, please reset your password within the next <strong>7 days</strong>.</p>
              
              <p>After 7 days, your current password may no longer be considered secure, and you could be asked to reset it again.</p>

              <div style="text-align: center;">
                <a href="file:///C:/Users/DELL/OneDrive/Desktop/najah/najah-frontend/login.html" class="button">Go to Login</a>
              </div>

              <p>Steps:</p>
              <ol>
                <li>Click the <strong>Login</strong> button above.</li>
                <li>Sign in using the email and temporary password we sent you earlier.</li>
                <li>Go to your profile/settings section and change your password to something only you know.</li>
              </ol>

              <p>If you didn't request or expect this account, please contact our support team immediately.</p>
              
              <p>Best regards,<br><strong>Najah Tutors Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated security reminder. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Reset reminder email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending reset reminder email:', error);
    throw error;
  }
};

// Send OTP for password reset
exports.sendPasswordOtpEmail = async (email, name, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Najah Tutors" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Najah Tutors - Password Reset OTP',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 24px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 24px; border-radius: 0 0 10px 10px; }
            .otp-box { background: #f0f0f0; padding: 15px; border-radius: 5px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 4px; color: #333; margin: 10px 0; }
            .footer { text-align: center; margin-top: 24px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset OTP</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>You requested to reset your Najah Tutors account password.</p>
              <p>Please use the following One Time Password (OTP) to reset your password:</p>
              <div class="otp-box">${otp}</div>
              <p>This OTP is valid for the next <strong>10 minutes</strong>. Do not share this code with anyone.</p>
              <p>If you did not request a password reset, you can safely ignore this email.</p>
              <p>Best regards,<br><strong>Najah Tutors Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset OTP email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset OTP email:', error);
    throw error;
  }
};
