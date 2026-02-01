import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'localhost',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendMail = async (options: { to: string; subject: string; html: string; text?: string }) => {
    // Falls back to logging if SMTP is not configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.log('--- EMAIL SIMULATION ---');
        console.log(`To: ${options.to}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Content: ${options.text || 'HTML Content (see log above)'}`);
        console.log('-------------------------');
        return;
    }

    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM || '"VSIBL Security" <security@vsibl.com>',
            ...options,
        });
    } catch (error) {
        console.error('Email delivery failed:', error);
        throw new Error('Failed to send verification email');
    }
};

export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
鼓
鼓
