import express from "express";
import {
    allPosts,
    createPost,
    getPost,
    deletePost,

    submitReactions,
    fetchReactions,
    followAuthor,
    fetchIfFollowing,
    updatePost
} from "../controllers/post.controller.js";

import verifyUser from "../middlewares/auth.middleware.js";
import isOwner from "../middlewares/deleteAuth.middleware.js";
import {upload} from "../middlewares/uploads.middleware.js";

const route = express.Router();

route.put('/posts/updatePost', verifyUser, isOwner,  updatePost);
//route.delete('/posts/updatePost', verifyUser, isOwner,  deletePost);
route.get('/post/fetchReactions', fetchReactions);
route.post('/post/fetchIfFollowing', verifyUser, fetchIfFollowing); //fetches the following status of the person
route.post('/post/followAuthor',  verifyUser,  followAuthor);
route.post('/post/submitReactions', verifyUser, submitReactions); //used to update reactions
route.post('/post/createPost', verifyUser, upload.array('post-pictures', 5), createPost);
route.get('/post/allPosts', allPosts);
route.get('/post/getPost', getPost);
route.delete('/post/deletePost', verifyUser, isOwner, deletePost);
//route.post('/login', login);

export default route;