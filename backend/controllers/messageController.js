import { Message } from "../models/messages.js";
import { Conversation } from "../models/conversations.js";

const getMessages = async (req, res) => {
    
    try {
        const { conversationId } = req.query;
        // console.log("ConversationId,", conversationId);
        const curMessages = await Message.find({conversationId: conversationId}).sort('timeStamp');

        res.status(200).json({curMessages});
    } catch (error) {
        res.status(500).json({ messages: "Error Getting Messages", error });
    }

};

const sendMessage = async (req, res) => {

    try {

        const { conversationId, senderId, receiverId, content } = req.body;
        const newMessage = await Message.create({ conversationId, senderId, receiverId, content });

        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: newMessage._id,
            updatedAt: Date.now()
        });

        res.status(200).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: "Failed to Send Message", error });
    }

};

export { getMessages, sendMessage };