import { User } from "../models/userModel.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt, { decode } from 'jsonwebtoken';

dotenv.config();

// Add new user to the database using encrypted password
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

// Log in user to the databse
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // First make sure user exists
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Make sure encrypted password matches password entered
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        jwt.sign(
            { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: "4h" },
            (error, token) => {

                if(error) {
                    return res.status(500).json({ error: "Error Generating Token" });
                }

                // Create a cookie
                res.cookie('token', token, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });

                // Return only relevant information necessary in the frontend (no password)
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

// Returns infromation regarding a specific user
const getUserProfile = async (req, res) => {

    // First gets the jwt token and make sure it exists to see that they are logged in
    const { token } = req.cookies;

    if(!token) return res.json(null);

    try {

        jwt.verify(token, process.env.JWT_SECRET, async (error, decodedToken) => {
            
            if(error) {
                console.log("Error: ", error);
                return res.status(500).json({ error: "Error verifying token" });
            }

            // Once token is decoded, use it to get the user information from database
            const user = await User.findById(decodedToken.id);

            if(!user) {
                return res.status(400).json({ error: "User not found" });
            }

            res.json({user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                admin: user.admin,
                goodStanding: user.goodStanding,
                score: user.score
            }});
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

// Gets specific user information by their id
const getUserById = async (req, res) => {

    try {
        const { user_id } = req.query;

        const user = await User.findById(user_id);

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ error: error });
    }

}

// Clears the cookie associated to the user
const signOutUser = async (req, res) => {

    try {

        res.clearCookie('token', { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production'});

        return res.status(200).json({ message: "Signed Out Successfully "});
    } catch (error) {
        
        return res.status(500).json({ error: error });

    }

}

// Factors in recent user rating to calculate new user rating
const updateUserRating = async (req, res) => {

    const { user_id, rating } = req.body;
    console.log(user_id);
    try {

        const user = await User.findOne({ _id: user_id });

        // Just a cummulative moving average
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

// Only for test purposes
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
