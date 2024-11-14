import express from "express";
import verifyAdmin from "../middleware/adminMiddleware.js";
import { User } from "../models/userModel.js";

const adminRouter = express.Router();

adminRouter.get('/dashboard', verifyAdmin, async (req, res) => {
    try {
        const users = await User.find(); 
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

export default adminRouter;
