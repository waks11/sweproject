import mongoose from "mongoose";

const Schema = mongoose.Schema;

const messageSchema = Schema({
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: 'Conversations',
        required: true
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    timeStamp: {
        type: Date,
        default: Date.now
    },
    read: {
        type: Boolean,
        default: false
    },
    readAt: Date
});

export const Message = mongoose.model('Messages', messageSchema, 'Messages');