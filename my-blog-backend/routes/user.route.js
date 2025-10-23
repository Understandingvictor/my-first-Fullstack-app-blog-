import express from "express";
import {allUsers, createUser, getUser, deleteUser, addBio, updateUserProfilePic } from "../controllers/user.controller.js";
import isAdmin from "../middlewares/isAdmin.middleware.js";
import verifyUser from "../middlewares/auth.middleware.js";
import { body } from "express-validator";
import { upload, multipleFilesField } from "../middlewares/uploads.middleware.js";

const multiplePicsAndField = multipleFilesField("profilePics", "backgroundPics");
const emailChecking = () => body('email').notEmpty().isEmail().withMessage('add a valid email');
const usernameChecking = () => body('username').notEmpty().withMessage("username cannot be blank");
const route = express.Router();

route.post('/user/updateUserProfilePic', verifyUser, upload.single('profilePic'),updateUserProfilePic);
route.get('/user/allUsers', allUsers);
route.post('/user/addBio', verifyUser, addBio);
route.post('/user/createUser', [emailChecking(), usernameChecking()], createUser);
route.get("/user/getUser", verifyUser, getUser);
route.delete('/user/deleteUser', verifyUser, isAdmin,  deleteUser );

export default route;