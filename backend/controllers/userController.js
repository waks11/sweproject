import { User } from "../models/userModel.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const createUser = async (req, res) => {

    const {firstName, lastName, email, password} = req.body;

    try {
        const user = await User.create({firstName, lastName, email, password});
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

}

export default createUser;