import mongoose from "mongoose";

const Schema = mongoose.Schema;

const conversationSchema = Schema({
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Users',
        },
    ],
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Messages'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export const Conversation = mongoose.model('Conversations', conversationSchema, 'Conversations');
