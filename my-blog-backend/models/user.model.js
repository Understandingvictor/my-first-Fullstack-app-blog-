import mongoose, { Mongoose } from "mongoose";

const userSchema = new mongoose.Schema({

        username:{
        type:String,
        required:true
    },
    OAUTH: {
        type: Boolean,
        default:false
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
    },
    profilePics:{
        type: String,
        required: false,
        default: undefined
    },
    backgroundPics:{
        type:String,
        required:false
    },
    isAdmin:{
        type:Boolean,
        default: false
    },
    kyc:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Kyc',
    },
    followersCount: {
        type: Number,
        default: 0
    },
    followers: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Posts'
    }],
    bio: {
        type: String,
        default:"add about section"
    }
})

const userModel = mongoose.model('Users', userSchema);
export default userModel;