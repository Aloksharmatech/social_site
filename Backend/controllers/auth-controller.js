const User = require("../models/user-model");
const OTP = require("../models/otp-model");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const registerStepOne = async (req, res) => {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({ email, otp });
    await sendEmail(email, otp);

    res.status(200).json({ message: "OTP sent to email" });
};

const registerStepTwo = async (req, res) => {
    const { email, otp, username, password } = req.body;

    const existingOtp = await OTP.findOne({ email, otp });
    if (!existingOtp) return res.status(400).json({ message: "Invalid or expired OTP" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, username, password: hashedPassword });

    await OTP.deleteMany({ email });

    res.status(201).json({ message: "Account created successfully" });
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter both email and password.",
                success: false
            })
        }

        const normalizedEmail = email.toLowerCase();
        let existingUser = await User.findOne({ email: normalizedEmail });
        if (!existingUser) {
            return res.status(401).json({
                message: "Invalid email or password",
                success: false
            });
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password",
                success: false
            })
        }

        const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });


        existingUser = {
            _id: existingUser._id,
            username: existingUser.username,
            email: existingUser.email,
            profilePicture: existingUser.profilePicture,
            bio: existingUser.bio,
            followers: existingUser.followers,
            following: existingUser.following,
            posts: populatedPosts
        }
        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${existingUser.username}`,
            success: true,
            existingUser
        });


    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
}


const forgotPassword = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not registered" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({ email, otp });

    await sendEmail(email, otp);

    res.status(200).json({ message: "OTP sent to your email" });
};

const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    const validOtp = await OTP.findOne({ email, otp });
    if (!validOtp) return res.status(400).json({ message: "Invalid or expired OTP" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    await OTP.deleteMany({ email });

    res.status(200).json({ message: "Password reset successful" });
};

const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "strict",
        });

        return res.status(200).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            message: "Server error during logout",
            success: false
        });
    }
};

module.exports = { registerStepOne, registerStepTwo, loginUser, forgotPassword, resetPassword, logout };
