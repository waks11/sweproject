import mongoose from "mongoose";

const Schema = mongoose.Schema;

const reportSchema = Schema({
    reporterId: {
        type:Schema.Types.ObjectId,
        ref: 'Users',
    },
    reportedUserId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    reportedConversationId: {
        type: Schema.Types.ObjectId,
        ref: 'Conversations',
        required: true
    },
    reportedDescription: {
        type: String,
        required: true
    }
});

export const Report = mongoose.model('Reports', reportSchema, 'Reports');