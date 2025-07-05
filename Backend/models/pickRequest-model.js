// models/pickRequest-model.js

const mongoose = require("mongoose");

// Define the PickRequest schema
const pickRequestSchema = new mongoose.Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        duration: {
            value: { type: Number, required: true },
            unit: { type: String, enum: ["minutes", "hours", "days"], required: true },
        },

        offeredAmount: { type: Number, required: true },

        expirationDuration: {
            value: { type: Number, required: true },
            unit: { type: String, enum: ["minutes", "hours", "days"], required: true },
        },

        expiresAt: { type: Date }, // ✅ No 'required: true' since it's computed in pre-save

        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "expired"],
            default: "pending",
        },

        isHandled: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// ✅ TTL Index for automatic deletion
pickRequestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ✅ Pre-save hook to calculate expiresAt
pickRequestSchema.pre("save", function (next) {
    if (!this.expiresAt) {
        const now = new Date();
        const durationMap = {
            minutes: 60 * 1000,
            hours: 60 * 60 * 1000,
            days: 24 * 60 * 60 * 1000,
        };
        const ms = this.expirationDuration.value * durationMap[this.expirationDuration.unit];
        this.expiresAt = new Date(now.getTime() + ms);
    }
    next();
});

// ✅ Export the model correctly
const PickRequest = mongoose.model("PickRequest", pickRequestSchema);
module.exports = PickRequest;
