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
import reportRouter from "./routes/reportRouter.js";

import adminRouter from "./routes/adminRouter.js";

dotenv.config();

// Create new express app and server
const app = express();
const server = http.createServer(app);

// Setup sockets
socketHandler(server);

// Connect to frontend using CORS
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
};

// Set up api use
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
app.use('/api/admin', adminRouter);
app.use('/api/reports', reportRouter);

const connectionString = process.env.MONGO_URI;

// Connect to mongo backend and listen for events from sockets
mongoose.connect(connectionString).then(() => {
    
    console.log("Connected to DB");

    server.listen(process.env.PORT, () => {
        console.log(`Server Running on Port ${process.env.PORT}`);
    });    

}).catch((error) => {
    console.log(error);
});
