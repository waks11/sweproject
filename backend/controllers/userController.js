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

        try {
            const user = await User.create({
                firstName, 
                lastName, 
                email, 
                password: hashedPassword});

            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ error: "User Already Exists"});
        }
        
        
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

}


const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        jwt.sign(
            { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" },
            (error, token) => {

                if(error) {
                    return res.status(500).json({ error: "Error Generating Token" });
                }

                res.cookie('token', token, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });

                return res.status(200).json({ message: "Logged in", user : {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    admin: user.admin,
                    goodStanding: user.goodStanding,
                    score: user.score
                }});

            } 
        );
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getUserProfile = (req, res) => {

    const { token } = req.cookies;

    if(!token) return res.json(null);

    try {

        jwt.verify(token, process.env.JWT_SECRET, {}, (error, user) => {
            
            if(error) {
                console.log("Error: ", error);
                return res.status(500).json({ error: "Error verifying token" });
            }

            res.json(user);
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

const getUserById = async (req, res) => {

    try {
        const { user_id } = req.query;

        const user = await User.findById(user_id);

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ error: error });
    }

}

const signOutUser = async (req, res) => {

    try {

        res.clearCookie('token', { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production'});

        return res.status(200).json({ message: "Signed Out Successfully "});
    } catch (error) {
        
        return res.status(500).json({ error: error });

    }

}

const updateUserRating = async (req, res) => {

    const { user_id, rating } = req.body;
    console.log(user_id);
    try {

        const user = await User.findOne({ _id: user_id });

        const newNumOfRatings = user.numOfRatings + 1;
        const newRating = (user.score + rating) / (newNumOfRatings);

        const result = await User.updateOne(
            { _id: user_id },
            { $set: { score: newRating, numOfRatings: newNumOfRatings }},
        );

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ message: "Failed to update user rating", error });
    }

}

const updateNewField = async (req, res) => {

    try {

        const result = await User.updateMany(
            {},
            { $set: { numOfRatings: 0, score: 0, goodStanding: true, admin: false }}
        );

        res.status(200).json(result);
    } catch(error) {
        res.status(500).json("Error updating fields in User schema", error);
    }

}

export { createUser, loginUser, getUserProfile, getUserById, signOutUser, updateUserRating, updateNewField };
