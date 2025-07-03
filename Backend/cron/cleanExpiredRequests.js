const cron = require("node-cron");
const PickRequest = require("../models/PickRequest");
const User = require("../models/User");

const runCleanupCron = () => {
    cron.schedule("*/5 * * * *", async () => {
        const now = new Date();

        try {
            const expiredRequests = await PickRequest.find({
                expiresAt: { $lte: now },
                status: "pending",
                isHandled: false,
            });

            for (const request of expiredRequests) {
                const senderId = request.sender;
                const receiverId = request.receiver;
                const requestId = request._id;

                // Remove references
                await User.findByIdAndUpdate(senderId, { $pull: { picks: requestId } });
                await User.findByIdAndUpdate(receiverId, { $pull: { seekers: requestId } });

                // Optional: send notification here

                // Delete pick request
                await PickRequest.findByIdAndDelete(requestId);

                console.log(`Deleted expired pick request: ${requestId}`);
            }
        } catch (err) {
            console.error("Error running cleanup cron:", err);
        }
    });
};

module.exports = runCleanupCron;
