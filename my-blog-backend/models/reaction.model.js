import mongoose, { Mongoose } from "mongoose";

const reactionSchema = new mongoose.Schema({

    likes: {
        type: Boolean,
        default:false
    },
    
    dislikes: {
        type: Boolean,
        default:false
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Posts'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Users'
    }
}, {timestamps:true});

const reactionModel = mongoose.model('Reactions', reactionSchema);
export default reactionModel;