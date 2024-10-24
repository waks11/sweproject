import mongoose from "mongoose";

const Schema = mongoose.Schema;

const embeddingSchema = Schema({
    text: { 
        type: String, 
        required: true 
    },
    embedding: { 
        type: [Number], 
        required: true, 
        index: 'vector_index' 
    },
    metadata: [{
        source: {
            type: Schema.Types.ObjectId,
            required: true
        }
    }]
});

export const EmbeddedItem = mongoose.model('DescriptionEmbeddings', embeddingSchema, 'DescriptionEmbeddings');