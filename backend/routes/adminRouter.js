import express from "express";
import verifyAdmin from "../middleware/adminMiddleware.js";
import { User } from "../models/userModel.js";

const adminRouter = express.Router();

// Checks to make sure the user is an admin
adminRouter.get('/dashboard', verifyAdmin, async (req, res) => {
    try {
        const users = await User.find({ $or: [{ admin: false }, { admin: { $exists: false }}]}); 
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// When admin decides a report is valid, they can change the user's goodStanding 
adminRouter.put('/update-good-standing/:id', verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { goodStanding } = req.body;

        const user = await User.findByIdAndUpdate(id, { goodStanding }, { new: true });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});


export default adminRouter;
