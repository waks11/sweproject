import { Conversation } from "../models/conversations.js";

const getConversations = async(req, res) => {

    try {
        
        const { user_id } = req.params;

        const conversations = await Conversation.find({
            users: user_id
        }).populate('lastMessage').sort('-updatedAt');

        res.status(200).json(conversations);

    } catch (error) {
        res.status(500).json({ message: "Failed to Fetch Conversations", error });
    }

};

const getConversationById = async (req, res) => {

    try { 

        const { user_id } = req.params; 

        const conversation = await Conversation.findById(user_id).populate('lastMessage');

        if(!conversation) {
            return res.status(404).json({ message: "Conversation Not Found" });
        }
        res.status(200).json(conversation);

    } catch (error) {
        res.status(500).json({ message: "Failed to Fetch Conversation", error });
    }

};

const getConversationByUsers = async (req, res) => {

    try {

        const { senderId, receiverId } = req.params;

        const conversation = await Conversation.find({
            users: { $all: [senderId, receiverId] }
        });

        if(!conversation) {
            return res.status(404).json({ message: "Conversation Does Not Exist" });
        }

        res.status(200).json(conversation);
    } catch (error) {
        res.status(500).json({ message: "Failed to Get Conversation By Users" });
    }

}

const checkIfConversationExists = async (req, res) => {

    try {

        const { senderId, receiverId } = req.params;

        const conversation = await Conversation.find({ users: { $all: [senderId, receiverId] }, });

        if(!conversation) {
            return res.status(200).json(false);
        }
        else {
            return res.status(200).json(true);
        }

    } catch (error) {
        res.status(500).json({ message: "Failed to Check if Conversation Existed", error });
    }

}

const createConversation = async (req, res) => {

    try {
        const { senderId, receiverId } = req.body;
        const newConversation = await Conversation.create({ users: [senderId, receiverId] });

        res.status(200).json(newConversation);
    } catch (error) {
        res.status(500).json({ message: "Failed to Create Conversation", error });
    }

};

export { getConversations, getConversationById, createConversation, checkIfConversationExists, getConversationByUsers };