import express from "express";
import {createUser, getUserProfile, loginUser, signOutUser} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post('/signup', createUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', signOutUser);
userRouter.get('/getUser', getUserProfile);

export default userRouter;

