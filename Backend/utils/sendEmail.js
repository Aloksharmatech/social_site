const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail", 
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS, 
        },
    });

    const mailOptions = {
        from:process.env.EMAIL,
        to: email,
        subject: "Verify your email",
        text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
