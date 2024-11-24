import dotenv from "dotenv";
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from "cookie-parser";
import http from "http";

import socketHandler from "./socket.js";
import userRouter from "./routes/userRouter.js";
import itemRouter from "./routes/itemRouter.js";
import conversationRouter from "./routes/conversationRouter.js";
import messageRouter from "./routes/messageRouter.js";

import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

dotenv.config();

const app = express();
const server = http.createServer(app);

socketHandler(server);

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
};

// const embeddings = new HuggingFaceInferenceEmbeddings({
//     apiKey: process.env.HUGGING_FACE_TOKEN,
//     model: 'sentence-transformers/all-MiniLM-L6-v2'
// });

// console.log("Init embeddings model");
// embeddings.embedDocuments(["init"]);

// const attachEmbeddings = (req, res, next) => {
//     req.embeddings = embeddings;
//     next();
// }

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(req.path, res.method);
    next()
});

app.use('/api/users', userRouter);
app.use('/api/lostItems', itemRouter);
app.use('/api/conversations', conversationRouter);
app.use('/api/messages', messageRouter);

const connectionString = process.env.MONGO_URI;

mongoose.connect(connectionString).then(() => {
    
    console.log("Connected to DB");

    app.listen(process.env.PORT, () => {
        console.log("Listening on Port", process.env.PORT)
    });

}).catch((error) => {
    console.log(error);
});
