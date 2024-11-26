import express from "express";
import {createUser, getUserProfile, loginUser, signOutUser, getUserById} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post('/signup', createUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', signOutUser);
userRouter.get('/getUser', getUserProfile);
userRouter.get('/getUserById', getUserById);

export default userRouter;

