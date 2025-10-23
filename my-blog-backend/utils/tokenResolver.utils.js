import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
dotenv.config();

const resolveToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.REFRESHTOKEN_SECRET_KEY );
        if (!decoded.userId) {
            throwErrorMessage("userId not found", 401);
        }
        return decoded.userId;
    } catch (error) {
        throw error;
    }

}
export default resolveToken;