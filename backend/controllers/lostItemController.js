import { LostItem } from "../models/itemModel.js";
import { EmbeddedItem } from "../models/embeddingModel.js";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const embeddings = new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HUGGING_FACE_TOKEN,
    model: 'sentence-transformers/all-MiniLM-L6-v2'
});

async function getEmbeddings(description) {

    try {

        const embedding = await embeddings.embedDocuments([description]);

        return {embeddings: embedding[0]};

    } catch (err) {
        console.error("Error embedding description: ", err);
    }

}

const createPost = async (req, res) => {

    console.log(req.file);

    const { user_id, description, location } = req.body;

    const image_url = req.file?.location;

    try {
        const {embeddings} = await getEmbeddings(description);

        const item = await LostItem.create({ user_id, image_url, description, location, embedding: embeddings });
        
        // const queryItem = await LostItem.findOne({ user_id: user_id });

        // const embeddedItem = await EmbeddedItem.create({ text: completeDescription, embedding: embeddings, metadata: [{ source: queryItem.id }]});

        res.status(200).json({item});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

};

const getSemanticSearch = async (req, res) => {

    const { user_search } = req.query;

    if(!user_search) {
        console.error("Error Receiving Search Query");
        res.status(400);
    }

    try {

        const collection = mongoose.connection.collection('LostItems');

        const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
            collection,
            indexName: "vector_index",
            textKey: "description",
            embeddingKey: "embedding"
        });

        const top3Results = await vectorStore.similaritySearchWithScore(user_search, 3);

        let items = [];

        for (const [doc, score] of top3Results) {
            if(score >= 0.70) {
                items.push({
                    user_id: doc.metadata.user_id,
                    image_url: doc.metadata.image_url,
                    description: doc.pageContent,
                    score: score,
                    location: doc?.location,
                });
            }
        }

        res.status(200).json({items});

    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}

const getImageUrl = async(req, res) => {

    const { user_id, description } = req.query;

    try {

        const item = await LostItem.findOne({ user_id: user_id, description: description });

        res.status(200).json(item.image_url);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }


}


const getPaginatedItems = async (req, res) => {

    const { page, limit } = req.query;


    try {
        const totalDocuments = await LostItem.countDocuments();

        // page - 1 because we want to start from where previous page stopped
        const start = (page - 1) * limit;

        const items = await LostItem.find().skip(start).limit(limit);

        const hasMore = (page * limit < totalDocuments);

        res.status(200).json({items, hasMore});

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

}


export { createPost, getSemanticSearch, getImageUrl, getPaginatedItems };

