import mongoose from "mongoose";

const Schema = mongoose.Schema;

const itemSchema = Schema({
    user_id: { type: Schema.Types.ObjectId, unique: true, required: true },
    image_url: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: false },
});

export const LostItem = mongoose.model('LostItems', itemSchema, 'LostItems');