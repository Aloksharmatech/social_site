const User = require("../models/user-model");
const PickRequest = require("../models/pickRequest-model");
const mongoose = require("mongoose");


// Create a Pick Request with Transaction
const createPickRequest = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { receiverId, duration, offeredAmount, expirationDuration } = req.body;
        const senderId = req.user.id;

        // Check if both users exist
        const [currentUser, targetUser] = await Promise.all([
            User.findById(senderId).session(session),
            User.findById(receiverId).session(session),
        ]);

        if (!currentUser || !targetUser) {
            await session.abortTransaction();
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        // Prevent duplicate pending pick requests
        const existingRequest = await PickRequest.findOne({
            sender: senderId,
            receiver: receiverId,
            status: "pending",
        }).session(session);

        if (existingRequest) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "A pending pick request already exists.",
                success: false,
            });
        }

        // Create new PickRequest
        const pickRequest = new PickRequest({
            sender: senderId,
            receiver: receiverId,
            duration,
            offeredAmount,
            expirationDuration,
        });

        await pickRequest.save({ session });

        // Update sender's picks and receiver's seekers
        await Promise.all([
            User.findByIdAndUpdate(senderId, { $push: { picks: pickRequest._id } }, { session }),
            User.findByIdAndUpdate(receiverId, { $push: { seekers: pickRequest._id } }, { session }),
        ]);

        // Commit the transaction (everything is saved)
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            message: "Pick request created",
            pickRequest,
            success: true,
        });
    } catch (error) {
        console.error("Create PickRequest error:", error);
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({
            message: "Server error creating pick request",
            error: error.message,
            success: false,
        });
    }
};








// Accept a pick request
const acceptPickRequest = async (req, res) => {
    try {
        const pickRequest = await PickRequest.findById(req.params.id);

        if (!pickRequest) return res.status(404).json({ message: "PickRequest not found" });

        pickRequest.status = "accepted";
        pickRequest.isHandled = true;
        await pickRequest.save();

        res.status(200).json({ message: "Pick request accepted", pickRequest });
    } catch (error) {
        console.error("Accept PickRequest error:", error);
        res.status(500).json({ message: "Server error accepting pick request" });
    }
};

// Reject a pick request
const rejectPickRequest = async (req, res) => {
    try {
        const pickRequest = await PickRequest.findById(req.params.id);

        if (!pickRequest) return res.status(404).json({ message: "PickRequest not found" });

        pickRequest.status = "rejected";
        pickRequest.isHandled = true;
        await pickRequest.save();

        res.status(200).json({ message: "Pick request rejected", pickRequest });
    } catch (error) {
        console.error("Reject PickRequest error:", error);
        res.status(500).json({ message: "Server error rejecting pick request" });
    }
};

// Get pick requests for a user (either sender or receiver)
const getUserPickRequests = async (req, res) => {
    try {
        const userId = req.user._id;

        const sentRequests = await PickRequest.find({ sender: userId }).populate("receiver");
        const receivedRequests = await PickRequest.find({ receiver: userId }).populate("sender");

        res.status(200).json({ sentRequests, receivedRequests });
    } catch (error) {
        console.error("Get PickRequests error:", error);
        res.status(500).json({ message: "Server error fetching pick requests" });
    }
};

// Delete a pick request (admin/cron/cleanup usage)
const deletePickRequest = async (req, res) => {
    try {
        const pickRequest = await PickRequest.findById(req.params.id);
        if (!pickRequest) return res.status(404).json({ message: "PickRequest not found" });

        await pickRequest.deleteOne(); 

        res.status(200).json({ message: "Pick request deleted" });
    } catch (error) {
        console.error("Delete PickRequest error:", error);
        res.status(500).json({ message: "Server error deleting pick request" });
    }
};


module.exports = {
    createPickRequest,
    acceptPickRequest,
    rejectPickRequest,
    getUserPickRequests,
    deletePickRequest,
};