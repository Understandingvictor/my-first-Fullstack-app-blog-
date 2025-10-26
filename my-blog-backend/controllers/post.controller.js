import postModel from "../models/post.model.js";
import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import { cloudinaryUploader } from "../services/cloudinary.config.js";
import fs from 'fs/promises'; 
import throwErrorMessage from "../utils/errorHandler.utils.js";
import reactionModel from "../models/reaction.model.js";
import followersModel from "../models/followers.model.js";

//gets all posts
const allPosts = async(req, res, next)=>{
    try {
        let query = {}
        let endDATE;
        let startDate;
        const { date,
            endDate,
            category,
            id,
            requestFromDashboard, 
            requestfromHomepage, limit, skip, page } = req.query;
        
        let limitInt = parseInt(limit);
        let skipInt = parseInt(skip);        //console.log(date, endDate, category, id, requestFromDashboard, requestfromHomepage, "has returnrd")

        let currentPage = parseInt(page);

            if (requestfromHomepage) {
                const posts = await postModel.find().populate('user').limit(5).sort({ createdAt: -1 });//get post of a user
                return res
                    .status(200)
                    .json({ Posts: posts, message: `posts are ${posts.length} in number` });
            }
        if (id) {
            if (requestFromDashboard) {
                query.user = id  //a queryset to get posts of a particular user
                const posts = await postModel.find(query).populate('user').sort({ createdAt: -1 });//get post of a user
                return res
                    .status(200)
                    .json({ Posts: posts, message: `posts are ${posts.length} in number` });
            }
            query.user = id  //a queryset to get postrs of a particular user
            //console.log(query, "is the query");
            const posts = await postModel.find(query).populate('user').sort({ createdAt: -1 }).limit(5);//get post of a user
            //console.log(posts, "is the related post");
            return res.json({ Posts: posts, message: `posts are ${posts.length} in number` });
        }
        if (date) {
             startDate = new Date(date); //start date
             startDate.setHours(0, 0, 0, 0);

             endDATE = new Date(endDate); //end date
             endDATE.setHours(23, 59, 59, 999);
             query.createdAt = {$gte:startDate, $lte:endDate} //a queryset to get postrs not within a range of date
        }
        
        //coming from the filter for all posts in the posts page or pagwe catalogue
        if (category === "all") { //if category === all
            const posts = await postModel.find().populate('user').sort({ createdAt: -1 });;//get all posts
            return res
                .status(200)
                .json({ Posts: posts, message: `posts are ${posts.length} in number` });
        }
        if (category != "undefined") {
            query.category = category;
        }
        if (query?.category || query?.createdAt) {
            const posts = await postModel.find(query).populate('user').sort({ createdAt: -1 });//get all posts
            return res
                .status(200)
                .json({ Posts: posts, message: `posts are ${posts.length} in number` });
        }
        const numberOfPosts = await postModel.countDocuments();
        const numberOfPages = Math.ceil(numberOfPosts / limit);
        const pagesLeft = numberOfPages - currentPage;
        const posts = await postModel.find().populate("user").sort({ createdAt: -1 }).skip(skip).limit(limit);//get all posts
        
        return res
            .status(200)

            .json({ Posts: posts, Pages:numberOfPages, pagesLeft:pagesLeft, currentPage:currentPage, message: `posts are ${posts.length} in number` });
    } catch (error) {
        next(error);
    }
}

//endpoint to create post
const createPost= async(req, res, next)=>{
    try {
        const userObject = req.user; //checks for th user
        // console.log("we reached the create post endpoint")
        // console.log(userObject, "Showing we are logged in")
      const payload = req.body; //checks for the body
      const files = req.files; //checks for files
      const userId = userObject.userId; //grabs user id
      const pics = []; //holds the path to the pictures
      const secureUrls = []; //holds the secure urls to the pictures in cloud

      if (!userId || !payload) {
        throw new Error("user id not found try loggin in");
        }

        if (files) {
                for (let pic of files) {
                pics.push(pic["path"]);
            }

            for (let i = 0; i < pics.length; i++) {
                const result = await cloudinaryUploader(pics[i], "post pictures");
                if(!result){
                    await fs.unlink(pics[i]);
                    throw new Error('upload not successful');
                }
                secureUrls.push(result["secure_url"]);
            }
            
            //modify payload to include pointers to images in the database
            payload["pictures"] = secureUrls;
        }


      const newPost = new postModel({ ...payload, user: userId }); //we will see what happens here
      const savedPost = await newPost.save();

      //update for the related fields btw user and post model
      const foundUser = await userModel.findByIdAndUpdate(
        userId,
        { $push: { posts: savedPost } },
        { new: true }
      );
      return res.json({
        createdPost: savedPost,
        updatedUser: foundUser,
        message: "Post created and user updated",
      });
    } catch (error) {
        next(error);
    }
}

//get a particular post
const getPost= async(req, res, next)=>{
    try {
        const postIdObject = req.query;
        //const userObject = req.user;
        const postId = postIdObject?.postId;
        if (!postId) {
            throwErrorMessage('post Id not found', 404)
        }
        const foundPost = await postModel.findById(postId).populate({ path: "user", select: " username bio" });
        if (!foundPost) {
            throwErrorMessage("post not found", 404);
        }
            return res
            .status(200)
            .json({data:foundPost, message:"a Post gotten"})
    } catch (error) {
        console.log('error happened in the get post controller', error.message)
        next(error);
    }
}


//endpoint for updating of post
const updatePost = async(req, res, next)=>{
  try {
    const payload = req.body;
    const { postId } = req.query;

    const foundPost = await postModel.findById(postId);
      if (!foundPost) {
         
        throwErrorMessage('post not found', 404)
    }
      const updatedPost = await postModel.findByIdAndUpdate(postId,
          { title: payload.title, body: payload.body, category: payload.category },
          { new: true, });

      return res
          .status(200)
          .json({
              updatedPost: updatedPost, formerPost: foundPost,
      message: "updated successfully",
    });
  } catch (error) {
    next(error);
  }
}

//delete a particular post
const deletePost= async(req, res, next)=>{
    try {
        const { postId } = req.query;
        
        //console.log(postId, "is the  post id");

        if (!postId){
            throw new Error('post id not found');
        }

        const foundPost = await postModel.findById(postId);
        
        if(!foundPost){
            throw new Error('post not found');
        }
        // return res.send(`${foundPost._id} is the found post`);
        const deletedPost = await postModel.findByIdAndDelete(postId);
      
        //console.log(deletedPost, "is the deleted post");
        //update user model
        const updatedUser = await userModel.findByIdAndUpdate(foundPost.user, {$pull:{posts:foundPost._id}});
        return res.json({deletedPost:deletedPost, updatedUser:updatedUser, message: "a Post deleted"});
    } catch (error) {
        console.log('something happened in the deletepost endpoint');
        next(error);
    }
}

const submitReactions = async (req, res, next) => {
    const {userId} = req.user;
    try {
        const { like, dislike, postId } = req.query;

        //console.log(userId, "is the user id");
        //search if posts exists
        const isPostAvailable = await postModel.findOne({ _id: postId });
        const isUserIdAvailable = await userModel.findOne({ _id: userId });

        //checking if available, posts or user
        if (!isPostAvailable) {
            throwErrorMessage("post not found", 404);
        }
        if (!isUserIdAvailable) {
            throwErrorMessage("user not found", 404);
        }

        if (like) {
            const userReaction = await reactionModel.findOne({ userId: userId, postId: postId });
            //console.log(userReaction, "is the user reaction")
            if (userReaction) {
                if (userReaction.dislikes === true) {//this user disliked and now likes without disabling dislike
                    await reactionModel.findOneAndUpdate({ userId: userId, postId:postId  }, { dislikes: false, likes: true }, { new: true }); 
                    const foundPost = await postModel.findByIdAndUpdate(postId, { $inc: { likes: 1, dislikes: -1 } }, { new: true });
                    return res
                        .status(200).json({ data: foundPost, message: "success" });
                }
                const foundPost = await postModel.findByIdAndUpdate(postId, { $inc: { likes: -1 } }, { new: true });
                const deletedReaction = await reactionModel.findOneAndDelete({ userId: userId, postId:postId });
                //console.log(deletedReaction, "this is the deleted post");
                return res
                    .status(200)
                    .json({ data: foundPost, message: "success" });
            }
            if (!userReaction) {//first click
                //console.log(userReaction, "i am here cos of no user reaction")
                const foundPost = await postModel.findByIdAndUpdate(postId, { $inc: { likes: 1 } }, { new: true })
                //update reaction model;
                const newReaction = await (new reactionModel({ postId: postId, userId: userId, likes: true, dislikes: false })).save();
                //console.log(newReaction, "i am here cos of new user reaction")
                return res
                .status(200)
                .json({data:foundPost, message: "success" });
            }

            //const foundPost = await postModel.findByIdAndUpdate(postId, {$inc:{likes:1}}, {new:true})
            return res
                .status(501)
                .json({ message: "something went wrong" });
        }
        if (dislike) {
            const userReaction = await reactionModel.findOne({ userId: userId, postId: postId });
            if (userReaction) {
                if (userReaction.likes === true) {//this user "like"d and now "dislikes" without disabling "like"
                //     await reactionModel.findOneAndDelete({ userId: userId });
                     await reactionModel.findOneAndUpdate({ userId: userId, postId:postId }, { likes: false, dislikes:true }, { new: true });
                     const updatedPost = await postModel.findByIdAndUpdate(postId, { $inc: { dislikes: 1, likes:-1 }}, { new: true });
                     return res
                         .status(200)
                         .json({ data:updatedPost, message: "success" })
                }
                
                // if (userReaction.dislikes === true) {
                //     await reactionModel.findOneAndUpdate({ userId: userId }, { dislikes: false }, { new: true });
                //     const foundPost = await postModel.findByIdAndUpdate(postId, { $inc: { dislikes: -1 }}, { new: true });
                //     return res
                //         .status(200).json({ message: "success" });
                // }
  
                const updatedPost = await postModel.findByIdAndUpdate(postId, { $inc: { dislikes: -1 } }, { new: true });
                await reactionModel.findOneAndDelete({ userId: userId, postId:postId  });
                return res
                    .status(200)
                    .json({ data:updatedPost, message: "success" })
            }

            if (!userReaction) { //first time of reacting
                const updatedPost = await postModel.findByIdAndUpdate(postId, { $inc: { dislikes: 1 } }, { new: true })
                //update reaction model;
                const newReaction = await (new reactionModel({ postId: postId, userId: userId, dislikes: true, likes:false })).save();
                return res
                .status(200)
                .json({ data:updatedPost, message: "success" });
            }

            //const foundPost = await postModel.findByIdAndUpdate(postId, {$inc:{likes:-1}}, {new:true})
            return res
                .status(501)
                .json({ message: "sometiing went wrong" });
        }
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}

//handler for following author
const followAuthor = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { authorId } = req.query;
        
          //search if posts exists
        const isAuthorIdAvailable = await userModel.findOne({ _id: authorId});
        if (!isAuthorIdAvailable) {
            throwErrorMessage("author not found", 404)
        }
        const foundFollower = await followersModel.findOne({ userId, authorId });
        if (foundFollower) {
            const deletedFollower = await followersModel.findOneAndDelete({ userId: userId });
            //console.log(deletedFollower, "is the deleted follower")
            const updatedAuthorFollowership = await userModel.findByIdAndUpdate(authorId, { $inc: { followersCount: -1 } }, { new: true });
            return res
            .status(200)
            .json({ isFollowing: false,  message: 'unfollowed' });
        }
        //we update authors followers count and create newfollower instance for the author
        const updatedAuthorFollowership = await userModel.findByIdAndUpdate(authorId, { $inc: { followersCount: 1 } }, { new: true });
        const newFollower =  await (new followersModel({ following: true, userId: userId, authorId: authorId })).save();
        return res
            .status(200)
            .json({ isFollowing: true, message: 'Following successfully' });     
    } catch (error) {
        next(error);
    }
}


const fetchIfFollowing = async (req, res, next) => {
    try {
        const {userId} = req.user
        const {authorId } = req.query;
        const isFollowing = await followersModel.findOne({ userId: userId, authorId: authorId });
        
        if (!isFollowing) {
            return res
                .status(200) 
                .json({ isFollowing: false });
        }
        return res
            .status(200) 
            .json({ isFollowing: isFollowing.following });
    } catch (error) {
        next(error);
    }
}

const fetchReactions = async (req, res, next) => {
    try {
        const {postId } = req.query;
        const foundPost = await postModel.findOne({ _id: postId });
        return res
            .status(200)
            .json({ reactions: foundPost });
    } catch (error) {
        next(error);
    }
}

const fetchIfReacted = async (req, res, next)=>{
    try {
        const { userId } = req.user
        const {postId} = req.query
        if (!userId) throwErrorMessage("pls login", 401);

        cons
    } catch {
        
    }
}

export {
    allPosts,
    createPost,
    getPost,
    deletePost,
    submitReactions,
    fetchReactions,
    followAuthor,
    fetchIfFollowing,
    updatePost
}