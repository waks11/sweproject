import express from "express";
import {createUser, getUserProfile, loginUser, signOutUser, getUserById, updateUserRating, updateNewField} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post('/signup', createUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', signOutUser);
userRouter.get('/getUser', getUserProfile);
userRouter.get('/getUserById', getUserById);
userRouter.post('/updateRating', updateUserRating);
userRouter.post('/updateNewField', updateNewField);

export default userRouter;

