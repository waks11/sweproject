import { Conversation } from "../models/conversations.js";
import mongoose from "mongoose";

const getConversations = async(req, res) => {

    try {
        
        const { user_id } = req.query;
 
        const curConversations = await Conversation.find({
            users: user_id  
        })
        .populate({
            path: 'users',
            select: 'firstName lastName score'
        })
        .populate('lastMessage').sort('-updatedAt');

        res.status(200).json({curConversations});

    } catch (error) {
        res.status(500).json({ message: "Failed to Fetch Conversations", error });
    }

};

const getConversationById = async (req, res) => {

    try { 

        const { id } = req.query; 

        const conversation = await Conversation.findById(id).populate({
            path: 'users',
            select: 'firstName lastName'
        }).populate('lastMessage');

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
            users: { $all: [mongoose.Types.ObjectId(senderId), mongoose.Types.ObjectId(receiverId)] }
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

const archiveChat = async (req, res) => {

    const { conversationId } = req.body;
    
    try {

        const result = await Conversation.updateOne(
            {_id: conversationId},
            { $set: {isArchived: true }}
        );

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ message: "Failed to Archive Conversation", error });
    }

}

const createConversation = async (req, res) => {

    try {
        const { senderId, receiverId, item_id } = req.body;

        const newConversation = await Conversation.create({ 
            users: [
                senderId,
                receiverId
            ],
            lostItem: item_id
        });
        console.log("Made it here");
        res.status(200).json(newConversation);
    } catch (error) {
        res.status(500).json({ message: "Failed to Create Conversation", error });
    }

};

export { getConversations, getConversationById, createConversation, checkIfConversationExists, archiveChat, getConversationByUsers };