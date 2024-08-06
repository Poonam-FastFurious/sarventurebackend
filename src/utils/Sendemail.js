import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
      const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                  user: process.env.EMAIL_USERNAME,
                  pass: process.env.EMAIL_PASSWORD,
            },
            connectionTimeout: 60000,
      });

      const mailOptions = {
            from: 'Your App <rahulkumarofficial36@gamil.com>',
            to: options.email,
            subject: options.subject,
            text: options.message,
      };

      await transporter.sendMail(mailOptions);
};

export default sendEmail;
