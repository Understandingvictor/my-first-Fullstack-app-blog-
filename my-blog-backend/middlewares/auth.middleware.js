import jwt from 'jsonwebtoken'
import throwErrorMessage from "../utils/errorHandler.utils.js";

const verifyUser = (req, res, next)=>{
    try {
        //console.log(req.headers.authorization.split(" ")[1], "i entered auth middlewaree");
        let token = req.headers.authorization.split(" ")[1]; //we grab the token
       // console.log(token, "was received in auth middleware")
        if(!token || token === null){
            throwErrorMessage("session expired, pls login", 401);
        }

       // console.log(token, "is the token from auth middleware")
        jwt.verify(token, process.env.ACCESSTOKEN_SECRET_KEY, (error, decoded)=>{
            if (error) {
                return next(throwErrorMessage("invalid login from auth", 401));
            }
            req.user = {userId:decoded.userId}; 
            next();
        })   
    } catch (error) {
        next(error);
    }
}
export default verifyUser;