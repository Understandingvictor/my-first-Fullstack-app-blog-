import postModel from "../models/post.model.js";
import userModel from "../models/user.model.js";

//this middleware must positionally be run after user login is verified
const isOwner = async (req, res, next)=>{
    try {
        const userObject = req.user;
        const postIdObject = req.query;
        if (!userObject.userId || !postIdObject.postId){
            return res.json({message:'user ID or post ID not found'});
        }

        const userId = userObject.userId;
        const postId = postIdObject.postId;
        const userInfo = await userModel.findById(userId);
        const foundPost = await postModel.findById(postId);


    console.log(req.body, "is the payload")
      console.log(postId, "is the post id")
        if(foundPost){
            if (foundPost.user.toString() === userId.toString() || userInfo.isAdmin === true){
                next();
            }else{
                throw new Error('you are not the owner of this post or post not found'); //we return error here
            }
        }
        else{
            throw Error("post not found");
        }  
    } catch (error) {
        console.log(error.message);
        next(error);
    }
}

export default isOwner;