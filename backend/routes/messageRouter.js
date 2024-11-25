import express from "express";
import { getMessages, sendMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.post("/sendMessage", sendMessage);
messageRouter.get("/getMessages", getMessages);

export default messageRouter;