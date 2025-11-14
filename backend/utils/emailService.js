const nodemailer = require("nodemailer");
const crypto = require("crypto");

/**
 * Create a nodemailer transporter for Gmail SMTP
 */
const createTransporter = () => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error("Gmail SMTP credentials are not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables.");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not regular password
    },
  });
};

/**
 * Generate a secure random token for email verification
 * @returns {string} Verification token
 */
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Send email verification email
 * @param {string} email - Recipient email address
 * @param {string} token - Verification token
 * @param {string} baseUrl - Base URL of the application (for verification link)
 * @returns {Promise<Object>} Email sending result
 */
const sendVerificationEmail = async (email, token, baseUrl = null) => {
  try {
    const transporter = createTransporter();
    
    // Default verification URL - can be customized based on frontend route
    const verificationUrl = baseUrl 
      ? `${baseUrl}/verify-email?token=${token}`
      : `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-email?token=${token}`;

    const mailOptions = {
      from: `"${process.env.APP_NAME || "Booty Fitness"}" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email Address - Booty Fitness",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
            <h1 style="color: #333; text-align: center;">Welcome to Booty Fitness!</h1>
            <p>Thank you for registering with Booty Fitness. To complete your registration, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Verify Email Address
              </a>
            </div>
            
            <p style="font-size: 12px; color: #666;">Or copy and paste this link into your browser:</p>
            <p style="font-size: 12px; color: #666; word-break: break-all;">${verificationUrl}</p>
            
            <p style="font-size: 12px; color: #666; margin-top: 30px;">
              This verification link will expire in 24 hours. If you didn't create an account with Booty Fitness, please ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 11px; color: #999; text-align: center;">
              © ${new Date().getFullYear()} Booty Fitness. All rights reserved.
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to Booty Fitness!
        
        Thank you for registering. To complete your registration, please verify your email address by clicking the link below:
        
        ${verificationUrl}
        
        This verification link will expire in 24 hours. If you didn't create an account with Booty Fitness, please ignore this email.
        
        © ${new Date().getFullYear()} Booty Fitness. All rights reserved.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
};

/**
 * Calculate token expiry date (default: 24 hours from now)
 * @param {number} hours - Number of hours until expiry (default: 24)
 * @returns {Date} Expiry date
 */
const getTokenExpiry = (hours = 24) => {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + hours);
  return expiry;
};

module.exports = {
  sendVerificationEmail,
  generateVerificationToken,
  getTokenExpiry,
};

