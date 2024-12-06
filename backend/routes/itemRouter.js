import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
import path from "path";
import express from "express";
import { createPost, getSemanticSearch, getImageUrl, getPaginatedItems, deletePost } from "../controllers/lostItemController.js";

import {v4 as uuidv4} from "uuid";

dotenv.config();

const itemRouter = express.Router();

// Connect to S3
const s3 = new S3Client({
    region: process.env.S3_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        sessionToken: process.env.S3_SESSION_TOKEN // Comment out if you are the root user
    },
});

// Use multer as middleware to add the actual image to s3 while storing url in db
const upload = multer({

    storage: multerS3({
        s3,
        bucket: process.env.S3_BUCKET_NAME,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            const fileExt = path.extname(file.originalname);
            cb(null, `${uuidv4()}${fileExt}`);
        },
    })

});

itemRouter.post('/upload', upload.single('lostImage'), createPost);
itemRouter.get('/search/semantic', getSemanticSearch);
itemRouter.get('/getImageUrl', getImageUrl);
itemRouter.get('/getPage', getPaginatedItems);
itemRouter.delete('/delete/:id', deletePost);

export default itemRouter;