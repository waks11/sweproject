import express from "express";
import { getMessages, sendMessage } from "../controllers/messageController";

const messageRouter = express.Router();

messageRouter.post("/sendMessage", sendMessage);
messageRouter.post("/getMessages", getMessages);

export default messageRouter;