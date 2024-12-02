import { Message } from "../models/messages.js";
import { Conversation } from "../models/conversations.js";
import { PendingRating } from "../models/ratingModel.js";

const socketMap = new Map();

const socketHandlers = (io, socket) => {

    const handleSendMessage = async ({ conversationId, senderId, receiverId, content }) => {

        try {
            const newMessage = await Message.create({ conversationId, senderId, receiverId, content });

            await Conversation.findByIdAndUpdate(conversationId, {
                lastMessage: newMessage._id,
                updatedAt: Date.now(),
            });

            const receiverSockets = socketMap.get(receiverId) || [];

            receiverSockets.filter(({ conversationId: cid }) => cid === conversationId).forEach(({ socketId }) => {
                io.to(socketId).emit('receiveMessage', newMessage);
            })

            io.to(socket.id).emit('messageSent', newMessage);

        } catch (error) {
            console.error("Error handling sending message:", error);
        }

    };

    const handleCurrentlyTyping = ({ conversationId, senderId }) => {
        io.to(conversationId).emit('typing', {senderId});
    };

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

        const existingSockets = socketMap.get(userId) || [];
        existingSockets.push({ socketId: socket.id, conversationId });
        socketMap.set(userId, existingSockets);
        // socketMap.set(userId, [...existingSockets, { socketId: socket.id, conversationId }]);
        
        if(conversationId) {
            const unreadMessages = await Message.find({ receiverId: userId, read: false });
            socket.emit('unreadMessages', unreadMessages);
        }

        const ratings = await PendingRating.find({ receiverId: userId });
        ratings.forEach((ratingReq) => {
            socket.emit('rateUser', ratingReq);
        });

        await PendingRating.deleteMany({ receiverId: userId });
    };

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

    const handleRating = async ({ conversationId, raterId, receiverId }) => {

        try {
            const receiverSockets = socketMap.get(receiverId) || [];
            console.log("hi", receiverSockets);
            if(receiverSockets.some(({ conversationId: cid }) => cid === conversationId)) {
                console.log("other user online");
                receiverSockets.filter(({ conversationId: cid }) => cid === conversationId).forEach(({ socketId }) => {
                    io.to(socketId).emit('userRated', { raterId });
                });
            }
            else {
                console.log("PendingRating creation");
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