import { User } from "../models/userModel.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

dotenv.config();

const createUser = async (req, res) => {

    const {firstName, lastName, email, password} = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            firstName, 
            lastName, 
            email, 
            password: hashedPassword});
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

}



const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ error: "Invalid credentials" });
        }


        const token = jwt.sign(
            { id: user._id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" } 
        );

  
        res.status(200).json({ message: "Logged in", token, user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export { createUser, loginUser };
