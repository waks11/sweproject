import express from "express";
import { getConversations, getConversationById, createConversation } from "../controllers/conversationController";

const conversationRouter = express.Router();

conversationRouter.post('/createChannel', createConversation);
conversationRouter.get('/getAllConversations', getConversations);
conversationRouter.get('/getConversationById', getConversationById);

export default conversationRouter;