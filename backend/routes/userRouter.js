import express from "express";
import {createUser, getUserProfile, loginUser} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post('/signup', createUser);
userRouter.post('/login', loginUser);
userRouter.get('/getUser', getUserProfile);

export default userRouter;

