import express from "express";
import { getConversations, getConversationById, createConversation, checkIfConversationExists, archiveChat, getConversationByUsers } from "../controllers/conversationController.js";

const conversationRouter = express.Router();

conversationRouter.post('/createChannel', createConversation);
conversationRouter.get('/getAllConversations', getConversations);
conversationRouter.get('/getConversationById', getConversationById);
conversationRouter.get('/getConversationExists', checkIfConversationExists);
conversationRouter.get('/getConversationByUsers', getConversationByUsers);
conversationRouter.post('/archiveChat', archiveChat);

export default conversationRouter;