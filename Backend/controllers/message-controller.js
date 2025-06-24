const Conversation = require("../models/conversation-model");
const { getReceiverSocketId, io } = require("../socket/socket");
const Message = require("../models/message-model");


// Send a message
const sendMessage = async (req, res) => {
    try {
        const senderId = req.user.id;
        const receiverId = req.params.id;
        const { textMessage: message } = req.body;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        // Create conversation if it doesn't exist
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });

        if (newMessage) conversation.messages.push(newMessage._id);

        await Promise.all([conversation.save(), newMessage.save()]);

        // Real-time messaging
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }

        return res.status(201).json({
            success: true,
            newMessage
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Failed to send message' });
    }
};

// Get messages in a conversation
const getMessage = async (req, res) => {
    try {
        const senderId = req.user.id;
        const receiverId = req.params.id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate('messages');

        if (!conversation) {
            return res.status(200).json({ success: true, messages: [] });
        }

        return res.status(200).json({
            success: true,
            messages: conversation.messages
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Failed to fetch messages' });
    }
};

module.exports = { sendMessage, getMessage };
