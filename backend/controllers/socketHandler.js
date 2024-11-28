import { Message } from "../models/messages.js";
import { Conversation } from "../models/conversations.js";

const socketHandlers = (io, socket) => {

    const handleSendMessage = async ({ conversationId, senderId, receiverId, content }) => {

        try {
            const newMessage = await Message.create({ conversationId, senderId, receiverId, content });

            await Conversation.findByIdAndUpdate(conversationId, {
                lastMessage: newMessage._id,
                updatedAt: Date.now(),
            });

            io.to(receiverId).emit('receiveMessage', newMessage);
            io.to(senderId).emit('messageSent', newMessage);

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

            io.to(messageId).emit('messageRead', { messageId, receiverId });

        } catch (error) {
            console.error("Error in handling reading message:", error);
        }
    };

    // Gets the unread messages while they were offline
    const handleUserOnline = async (userId) => {

        console.log(`User ${userId} is online`);

        const unreadMessages = await Message.find({ receiverId: userId, read: false });

        socket.emit('unreadMessages', unreadMessages);

    };

    socket.on('sendMessage', handleSendMessage);
    socket.on('typing', handleCurrentlyTyping);
    socket.on('messageRead', handleMessageRead);
    socket.on('userOnline', handleUserOnline);

    socket.on('disconnect', () => {
        console.log("User Disconnected:", socket.id);
    });

};

export default socketHandlers;