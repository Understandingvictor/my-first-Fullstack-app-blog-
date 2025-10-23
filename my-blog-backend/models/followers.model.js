import mongoose, { Mongoose } from "mongoose";

const followersSchema = new mongoose.Schema({

    following: {
        type: Boolean,
        default:false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Users'
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Users'
    }
}, {timestamps:true});

const followersModel = mongoose.model('Followers', followersSchema);
export default followersModel;