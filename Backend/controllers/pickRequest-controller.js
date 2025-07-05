const User = require("../models/user-model");
const PickRequest = require("../models/pickRequest-model");



// Create a Pick Request
const createPickRequest = async (req, res) => {
    try {
        const { receiverId, duration, offeredAmount, expirationDuration } = req.body;
        const senderId = req.user.id;

        // Check if both users exist
        const [currentUser, targetUser] = await Promise.all([
            User.findById(senderId),
            User.findById(receiverId),
        ]);

        if (!currentUser || !targetUser) {
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
        });

        if (existingRequest) {
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

        await pickRequest.save();

        // Update sender's picks and receiver's seekers
        await Promise.all([
            User.findByIdAndUpdate(senderId, { $push: { picks: pickRequest._id } }),
            User.findByIdAndUpdate(receiverId, { $push: { seekers: pickRequest._id } }),
        ]);

        res.status(201).json({
            message: "Pick request created",
            success: true,
        });
    } catch (error) {
        console.error("Create PickRequest error:", error);
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

        const senderId = pickRequest.sender;
        const receiverId = pickRequest.receiver;

        // Remove from User collections
        await User.findByIdAndUpdate(senderId, { $pull: { picks: pickRequest._id } });
        await User.findByIdAndUpdate(receiverId, { $pull: { seekers: pickRequest._id } });

        await PickRequest.findByIdAndDelete(req.params.id);

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