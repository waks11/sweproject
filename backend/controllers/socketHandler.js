import { Message } from "../models/messages.js";
import { Conversation } from "../models/conversations.js";
import { PendingRating } from "../models/ratingModel.js";

// Map for corresponding id from db to socket_id
const socketMap = new Map();

const socketHandlers = (io, socket) => {

    // Alerts receiving user, if online, that they have a new message
    const handleSendMessage = async ({ conversationId, senderId, receiverId, content }) => {

        try {
            await Conversation.findByIdAndUpdate(conversationId, {
                lastMessage: newMessage._id,
                updatedAt: Date.now(),
            });

            const receiverSockets = socketMap.get(receiverId) || [];

            // Finds all curernt sockets connected to this conversation id and sends real-time receivedMessage event with the new Message
            receiverSockets.filter(({ conversationId: cid }) => cid === conversationId).forEach(({ socketId }) => {
                io.to(socketId).emit('receiveMessage', newMessage);
            });

            io.to(socket.id).emit('messageSent', newMessage);

        } catch (error) {
            console.error("Error handling sending message:", error);
        }

    };

    // Useful if we want to show when the other user is typing
    const handleCurrentlyTyping = ({ conversationId, senderId }) => {
        io.to(conversationId).emit('typing', {senderId});
    };

    // Useful for if we want to alert users when they have read the message or not
    const handleMessageRead = async ({ messageId, receiverId }) => {

        try {
            await Message.findByIdAndUpdate(messageId, {
                read: true,
                readAt: Date.now()
            });

            io.to(receiverId).emit('messageRead', { messageId, receiverId });

        } catch (error) {
            console.error("Error in handling reading message:", error);
        }
    };

    // Gets the unread messages while they were offline
    const handleUserOnline = async ({ userId, conversationId }) => {

        console.log(`User ${userId} is online`);
        
        // As soon as they are online we add them to the socketMap
        const existingSockets = socketMap.get(userId) || [];
        existingSockets.push({ socketId: socket.id, conversationId });
        socketMap.set(userId, existingSockets);
        
        if(conversationId) {
            const unreadMessages = await Message.find({ receiverId: userId, read: false });
            socket.emit('unreadMessages', unreadMessages);
        }

        // Get any pending rating requests they might have had in the database and make them do it as soon as they sign in
        const ratings = await PendingRating.find({ receiverId: userId });
        ratings.forEach((ratingReq) => {
            socket.emit('rateUser', ratingReq);
        });

        await PendingRating.deleteMany({ receiverId: userId });
    };

    // Maps users to their active conversations and associated socket connections
    const handleConversationActive = ({ userId, conversationId }) => {

        const sockets = socketMap.get(userId) || [];
        const socketIndex = sockets.findIndex(s => s.socketId === socket.id);

        if(socketIndex !== -1) {
            sockets[socketIndex].conversationId = conversationId;
        }
        else {
            sockets.push({ socketId: socket.id, conversationId });
        }

        socketMap.set(userId, sockets);
    };

    // As soon as one user fills out the rating form, sends the other user a request to fill it out as well
    const handleRating = async ({ conversationId, raterId, receiverId }) => {

        try {
            const receiverSockets = socketMap.get(receiverId) || [];
            
            // Check to see any sockets associated with the conversation
            if(receiverSockets.some(({ conversationId: cid }) => cid === conversationId)) {
                // Notify those socket ids that they have a rating request
                receiverSockets.filter(({ conversationId: cid }) => cid === conversationId).forEach(({ socketId }) => {
                    io.to(socketId).emit('userRated', { raterId });
                });
            }
            else {
                // If not currently online then add it to the database and will be retrieved when user is online again
                await PendingRating.create({ conversationId, raterId, receiverId });
            }

        } catch(error) {
            console.error("Error in socket handling rating", error);
        }
                
    }

    socket.on('sendMessage', handleSendMessage);
    socket.on('typing', handleCurrentlyTyping);
    socket.on('messageRead', handleMessageRead);
    socket.on('userOnline', handleUserOnline);
    socket.on('rateUser', handleRating);
    socket.on('conversationActive', handleConversationActive);

    socket.on('disconnect', () => {
        console.log("User Disconnected:", socket.id);

        for(const [userId, sockets] of socketMap.entries()) {
            const updated = sockets.filter(({ socketId }) => socketId !== socket.id);

            if(updated.length > 0) socketMap.set(userId, updated);
            else socketMap.delete(userId);
        }

    });

};

export default socketHandlers;