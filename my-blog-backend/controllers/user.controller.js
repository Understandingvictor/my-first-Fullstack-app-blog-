import { profile } from "console";
import userModel from "../models/user.model.js";
import {cloudinaryUploader} from '../services/cloudinary.config.js';
import deleteImages from "../utils/deleteImage.helpers.js";
import throwErrorMessage from "../utils/errorHandler.utils.js";
import { validationResult } from "express-validator";
import { hashPassword } from "../utils/passwordHashing.utils.js";

//gets all user
const allUsers = async(req, res, next)=>{
    try {
        const users = await userModel.find();
            return res.json({data:users, message: `users are ${users.length} in number`})
    } catch (error) {
        next(error);
    }
}


//creates user
const createUser = async(req, res, next)=>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json({ errors: errors.array() });
        }
        const payload = req.body;
       // const files = req.files;
        const userExisting = await userModel.findOne({email:payload.email});
        const usernameExisting = await userModel.findOne({ username: payload.username });
        if (userExisting || usernameExisting) {
            throwErrorMessage("user existing", 409);
        }
       
        const hashedPassword = hashPassword(payload.password);
        //creating instance and saving to database
        const newUser = new userModel({email:payload.email, password:hashedPassword, username:payload.username});
        const savedUser = await newUser.save();
        //console(`createdUser: ${savedUser}, message: user created` );
        return res.status(200).json({ createdUser: savedUser, message: "user created, now login"})
    } catch (error) {
        console.log("error happened in created user endpoint");
        console.log(error.message);
        next(error);
    }
}

//creates user
const createUserFromGoogle = async(req, res, next)=>{
    try {
        const payload = req.body;
       // const files = req.files;
        const userExisting = await userModel.findOne({email:payload.email});
        const usernameExisting = await userModel.findOne({ username: payload.username });
        if (userExisting || usernameExisting) {
            throwErrorMessage("user existing", 409);
        }
       
        const hashedPassword = hashPassword(payload.password);
        //creating instance and saving to database
        const newUser = new userModel({email:payload.email, password:hashedPassword, username:payload.username});
        const savedUser = await newUser.save();
        //console(`createdUser: ${savedUser}, message: user created` );
        return res.status(200).json({ createdUser: savedUser, message: "user created, now login"})
    } catch (error) {
        console.log("error happened in created user endpoint");
        console.log(error.message);
        next(error);
    }
}

//creates user
const updateUserProfilePic = async (req, res, next) => {
    const file = req.file;
    let filePath;
    console.log(file, "is the file");
    try {
        const { userId } = req.user;
        const { previousAvatar } = req.query;
        //console.log(file, "is the file received");
        //console.log("i entered here in the backend")
        if (!userId) {
            throwErrorMessage("pls loggin", 401);
        }
        // Convert \ to / so browser understands
        if (file && file !== undefined) {
              filePath = file.path.replace(/\\/g, "/");
        }
       
        const updatedUserProfile = await userModel.findOneAndUpdate({_id:userId}, {profilePics:`/${filePath}`}, {new:true})
        
        if (previousAvatar) {
            const result = deleteImages(previousAvatar, "uploads");
        }

        return res.status(200).json({ updatedUserProfile: updatedUserProfile, message: "Updated" });
    } catch (error) {
       // console.log("error happened in created user endpoint");
       // console.log(error.message);
          if (file && file !== undefined) {//checking if picture exists
            await fs.unlink(file.path); 
        }
        console.log(error.message);
        console.log("an error above")
        next(error);
    }
}


//get a particular user
const getUser = async(req, res, next)=>{
    try {
        const userObject = req.query;
        if (!userObject.userId){
            return res.json({message:"user id not found"})
        }
        const userId = userObject.userId;
        const foundUser = await userModel.findById(userId);
        if (!foundUser){
            return res.json({message:"user not found"});
        }
        return res.json({ data: foundUser, message: "a user gotten" });
    } catch (error) {
        console.log("error happened in get user endpoint");
        next(error);
    }
}

const addBio = async (req, res, next) => {
    try {
        const { bio } = req.body;
        const { userId } = req.user;
        //console.log(bio, userId, "is the bio and userId")
        if (!bio || !userId) {
            throwErrorMessage('pls add bio', 404);
        }
        const updatedUser = await userModel.findByIdAndUpdate(userId, { bio: bio }, { new: true });

        //console.log(updatedUser, "is the updated User");
        return res
            .status(200)
            .json({ bio:bio,  message: "bio updated successfully" });

    } catch (error) {
        //console.log(error.message)
        next(error);
    }
}

//deletes a user
const deleteUser = async(req, res, next)=>{
    try {
         const userObject = req.query;
          if (!userObject.userId){
            return res.json({message:"user id not found"})
        }
        const userId = userObject.userId;
        const deletedUser = await userModel.findByIdAndDelete(userId);
            return res.json({data:deletedUser, message:"a user deleted"})
    } catch (error) {
        //console.log("error happened in delete user endpoint");
        next(error);
    }
}

export {
    allUsers,
    createUser,
    getUser,
    deleteUser,
    addBio,
    updateUserProfilePic
}