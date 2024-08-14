const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com', 
            port: 587, 
            secure: false, 
            auth: {
                user: process.env.EMAIL, 
                pass: process.env.PASSWORD
            },
        });
    }

    async sendEmail({ to, subject, text }) {
        try {
            const from = process.env.EMAIL;
            let info = await this.transporter.sendMail({
                from,
                to, 
                subject, 
                text
            });

            console.log('Message sent: %s', info.messageId);
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}

module.exports = new EmailService();
