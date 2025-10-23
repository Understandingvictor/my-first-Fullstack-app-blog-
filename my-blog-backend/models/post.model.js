import mongoose, { Mongoose } from "mongoose";

const postSchema = new mongoose.Schema({
    title:{
       type:String
    },
    body:{
        type:String,
        required:false
    },
    pictures:{
        type:[String],
        default:[],
        required: false
    },
    category:{
        type:String,
        default:"others"
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Users'
    },
    likes: {
        type: Number,
        default:0
    },
    dislikes: {
        type: Number,
        default:0
    },
    shares: {
        type: Number,
        default:0
    }
}, {timestamps:true});

const postModel = mongoose.model('Posts', postSchema);
export default postModel;