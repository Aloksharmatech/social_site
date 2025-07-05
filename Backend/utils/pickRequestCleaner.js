const PickRequest = require("../models/pickRequest-model");

const cleanUpExpiredPickRequests = async () => {
    try {
        const now = new Date();
        const expiredRequests = await PickRequest.find({ expiresAt: { $lt: now } });

        for (const request of expiredRequests) {
            await request.deleteOne(); // triggers pre("deleteOne")
        }

        if (expiredRequests.length > 0) {
            console.log(`[${new Date().toLocaleTimeString()}] Cleaned ${expiredRequests.length} expired pick requests.`);
        }
    } catch (err) {
        console.error("Error cleaning expired PickRequests:", err);
    }
};

const startCleaner = () => {
    console.log("✅ PickRequest cleanup service started.");
    setInterval(cleanUpExpiredPickRequests, 30 * 1000); // runs every 30 sec
};

module.exports = startCleaner;
