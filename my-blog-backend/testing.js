let date = new Date().setHours(0,0,0,0).toLocaleString()
console.log(date);

import jwt from 'jsonwebtoken'
import throwErrorMessage from "../utils/errorHandler.utils.js";

const verifyUser = (req, res, next)=>{
    try {
        const cookie = req.cookies;
        //console.log(cookie, "is our cookie");
        if(!cookie?.token){
            throwErrorMessage("session expired, pls login", 401);
        }

        const token = cookie.token; //actual token
        jwt.verify(token, process.env.SECRET_KEY, (error, decoded)=>{
            if (error) {
                return next (throwErrorMessage("invalid login",401))
            }
            
            // ✅ Prevent caching of protected content
            res.set("Cache-Control", "no-store");
            req.user = {userId:decoded.userId}; 
            next();
        })   
    } catch (error) {
        next(error);
    }
}
export default verifyUser;