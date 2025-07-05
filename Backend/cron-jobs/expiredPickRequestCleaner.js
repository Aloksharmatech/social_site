const cron = require("node-cron");
const PickRequest = require("../models/pickRequest-model");
const User = require("../models/user-model");

// Cron job to clean expired pick requests
const cleanExpiredPickRequests = async () => {
    try {
        const expiredRequests = await PickRequest.find({ expiresAt: { $lt: new Date() } });

        if (expiredRequests.length === 0) return; // Nothing to delete

        await Promise.all(
            expiredRequests.map(async (request) => {
                try {
                    // Remove references from sender and receiver
                    await Promise.all([
                        User.updateOne({ _id: request.sender }, { $pull: { picks: request._id } }),
                        User.updateOne({ _id: request.receiver }, { $pull: { seekers: request._id } }),
                    ]);

                    // Delete the expired pick request
                    await PickRequest.deleteOne({ _id: request._id });

                    console.log(`Deleted expired PickRequest: ${request._id}`);
                } catch (err) {
                    console.error(`Error processing PickRequest ${request._id}:`, err);
                }
            })
        );
    } catch (err) {
        console.error("Failed to clean expired PickRequests:", err);
    }
};

// Run every 30 seconds
cron.schedule("*/30 * * * * *", cleanExpiredPickRequests);

console.log("⏰ Expired PickRequest cleaner scheduled to run every 30 seconds.");
