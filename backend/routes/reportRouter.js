import express from "express";
import { createReport, getReports } from "../controllers/reportController.js";

const reportRouter = express.Router();

reportRouter.post('/createReport', createReport);
reportRouter.get('/getReports', getReports);

export default reportRouter;