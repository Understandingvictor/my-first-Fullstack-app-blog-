import userModel from "../models/user.model.js";
const isAdmin = async (req, res, next)=>{
    try {
        const reqObject = req.query;
        if (!reqObject.userId){
            return res.json({message:'user ID not found'});
        }
        const userId = reqObject.userId;
        const foundUser = await userModel.findById(userId);
        if (foundUser.isAdmin === false){
            return res.json({message:'permission denied'})
        }
        next();
    } catch (error) {
        throw new error('something happened in isadmin section of middleware')
    }
}
export default isAdmin;