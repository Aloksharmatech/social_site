const mongoose = require("mongoose");

const pickRequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true, // The seeker
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true, // The one being picked
    },

    // Duration of hangout
    duration: {
        value: { type: Number, required: true },
        unit: {
            type: String,
            enum: ["minutes", "hours", "days"],
            required: true,
        },
    },

    // Offered payment
    offeredAmount: { type: Number, required: true },

    // Time given to accept the request
    expirationDuration: {
        value: { type: Number, required: true },
        unit: {
            type: String,
            enum: ["minutes", "hours", "days"],
            required: true,
        },
    },

    // Auto-calculated based on expirationDuration
    expiresAt: { type: Date },

    // Status tracking
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected", "expired"],
        default: "pending",
    },

    // Whether the receiver accepted/rejected the request
    isHandled: {
        type: Boolean,
        default: false,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

// Pre-save hook to set expiresAt
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

module.exports = mongoose.model("PickRequest", pickRequestSchema);
