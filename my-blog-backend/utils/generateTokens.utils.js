import jwt from "jsonwebtoken"

const generateAccessToken = (userId)=>{
    try {
        const payload = { userId: userId };
        const options = { expiresIn: "1m" };
        const token = jwt.sign(payload, process.env.SECRET_KEY, options);
        return token;
    } catch (error) {
        throw new Error(error.message);
    }
}
const generateRefreshToken =  (userId)=>{
    try {
        const payload = { userId: userId };
        const options = { expiresIn: "24hr" };
        const token = jwt.sign(payload, process.env.SECRET_KEY, options);
        return token;
    } catch (error) {
        throw new Error(error.message);
    }
}

export { generateAccessToken, generateRefreshToken };