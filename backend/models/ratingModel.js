import mongoose from "mongoose";

const Schema = mongoose.Schema;

const reportSchema = Schema({
    conversationId: { 
        type: Schema.Types.ObjectId,
        ref: 'Conversations',
        required: true
    },
    raterId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

export const PendingRating = mongoose.model("PendingRating", reportSchema, "Reports");