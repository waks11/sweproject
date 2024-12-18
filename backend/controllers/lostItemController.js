import { LostItem } from "../models/itemModel.js";
import { EmbeddedItem } from "../models/embeddingModel.js";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Hugging Face model used for vector embeddings
const embeddings = new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HUGGING_FACE_TOKEN,
    model: 'sentence-transformers/all-MiniLM-L6-v2'
});

// Convert user's description from text to vector embeddings
async function getEmbeddings(description) {

    try {

        const embedding = await embeddings.embedDocuments([description]);

        return {embeddings: embedding[0]};

    } catch (err) {
        console.error("Error embedding description: ", err);
    }

}

// Add the new post to the database with vector embeddings
const createPost = async (req, res) => {

    const { user_id, description, location } = req.body;

    const image_url = req.file?.location; // Makes sure that the location exists first

    try {
        const {embeddings} = await getEmbeddings(description);

        const item = await LostItem.create({ user_id, image_url, description, location, embedding: embeddings });

        const returnItem = {user_id: item.user_id, image_url: item.image_url, description: item.description, location: item.location};

        res.status(200).json({returnItem});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

};

// Searchs by user's query semantically
const getSemanticSearch = async (req, res) => {

    const { user_search } = req.query;

    if(!user_search) {
        console.error("Error Receiving Search Query");
        res.status(400);
    }

    try {

        const collection = mongoose.connection.collection('LostItems');

        // Create a vector store to allow us to use cosine similarity between embeddings
        const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
            collection,
            indexName: "vector_index",
            textKey: "description",
            embeddingKey: "embedding"
        });

        // Only get top 3 results so that we try to get the most semantically similar results
        const top3Results = await vectorStore.similaritySearchWithScore(user_search, 3);

        let items = [];

        // Checks to make sure that the cosine similarity is above a threshold of 0.63
        // Ensures that the documents being returned actually have similarity
        for (const [doc, score] of top3Results) {
            if(score >= 0.63) {

                items.push({
                    user_id: doc.metadata.user_id,
                    image_url: doc.metadata.image_url,
                    description: doc.pageContent,
                    score: score,
                    location: doc.metadata?.location,
                });
            }
        }

        res.status(200).json({items});

    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}

// Get an images's AWS S3 url given the id and description
const getImageUrl = async(req, res) => {

    const { user_id, description } = req.query;

    try {

        const item = await LostItem.findOne({ user_id: user_id, description: description });

        res.status(200).json(item.image_url);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }


}

// Uses Pagination to Return Items to the Frontend when needed
const getPaginatedItems = async (req, res) => {

    const { page, limit } = req.query;


    try {
        const totalDocuments = await LostItem.countDocuments();

        // page - 1 because we want to start from where previous page stopped
        const start = (page - 1) * limit;

        // Go from the "start" item until we hit our limit and return those items
        const items = await LostItem.find().sort({ _id: -1 }).skip(start).limit(limit);

        const hasMore = (page * limit < totalDocuments);

        res.status(200).json({items, hasMore});

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

}

// Deletes from post from the database
const deletePost = async (req, res) => {
    const { id } = req.params;
    const userId = req.query.user_id; // Get user ID from query parameters

    try {
        const item = await LostItem.findById(id);

        if (!item) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (item.user_id.toString() !== userId) {
            return res.status(403).json({ error: "You are not authorized to delete this post" });
        }

        await LostItem.findByIdAndDelete(id);

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { createPost, getSemanticSearch, getImageUrl, getPaginatedItems, deletePost };

