const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Built-in support for Gmail
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // 2) Define the email options
    const mailOptions = {
        from: `Glam Icon India <${process.env.EMAIL_USERNAME}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: options.html // You can add HTML templates later
    };

    // 3) Actually send the email
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('📧 Email sent successfully:', info.messageId);
    } catch (error) {
        console.error('❌ Email sending failed. Verify your EMAIL_USERNAME and EMAIL_PASSWORD in .env');
        console.error('Error details:', error.message);
        throw error; // Rethrow to be handled by the controller
    }
};

module.exports = sendEmail;
