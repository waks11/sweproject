import dotenv from "dotenv";
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from "cookie-parser";

import userRouter from "./routes/userRouter.js";
import itemRouter from "./routes/itemRouter.js";

dotenv.config();

const app = express();

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(req.path, res.method);
    next()
});

app.use('/api/users', userRouter);
app.use('/api/lostItems', itemRouter);

const connectionString = process.env.MONGO_URI;

mongoose.connect(connectionString).then(() => {
    
    console.log("Connected to DB");

    app.listen(process.env.PORT, () => {
        console.log("Listening on Port", process.env.PORT)
    });

}).catch((error) => {
    console.log(error);
});