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

async function getEmbeddings(description, location) {

    let completeDescription = description;

    if(location) {
        completeDescription += `\nLocation: ${location}`;
    }

    try {

        const embedding = await embeddings.embedDocuments([completeDescription]);

        return {embeddings: embedding[0], completeDescription: completeDescription};

    } catch (err) {
        console.error("Error embedding description: ", err);
    }

}

const createPost = async (req, res) => {

    console.log(req.file);

    const { user_id, description, location } = req.body;

    const image_url = req.file?.location;

    try {
        const {embeddings, completeDescription} = await getEmbeddings(description, location);

        const item = await LostItem.create({ user_id, image_url, description, location });
        
        const queryItem = await LostItem.findOne({ user_id: user_id });

        const embeddedItem = await EmbeddedItem.create({ text: completeDescription, embedding: embeddings, metadata: [{ source: queryItem.id }]});

        res.status(200).json({item, embeddedItem});
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

        const collection = mongoose.connection.collection('DescriptionEmbeddings');

        const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
            collection,
            indexName: "vector_index",
            textKey: "text",
            embeddingKey: "embedding"
        });

        const top3Results = await vectorStore.similaritySearchWithScore(user_search, 3);

        let items = [];

        for (const [doc, score] of top3Results) {
            if(score >= 0.6) {
                items.push(doc.metadata.metadata);
            }
        }

        res.status(200).json(items);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}

export { createPost, getSemanticSearch };

