import { generateAccessToken, generateRefreshToken } from "./generateTokens.utils.js";

const generateTokensAndLogin = (userId, res) => {
    try {
          const tokenForAccess = generateAccessToken(userId);
            const tokenForRefresh = generateRefreshToken(userId);
        
            //console.log(tokenForRefresh, "is the refresh token");
            return res
              .cookie("token", tokenForRefresh, {
                maxAge: 1200000 * 24,
                secure: true,
                httpOnly: true,
                sameSite: "strict",
                path: "/", // Adjust based on how the cookie was originally set
              })
              .status(200)
              .json({ accessToken: tokenForAccess, message: "logged in successfully" });
    } catch (error) {
        throw error;
    }
}
export default generateTokensAndLogin;