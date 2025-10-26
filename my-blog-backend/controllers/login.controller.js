import userModel from "../models/user.model.js";
import throwErrorMessage from "../utils/errorHandler.utils.js";
import resolveToken from "../utils/tokenResolver.utils.js";
import { unhashPassword, hashPassword } from "../utils/passwordHashing.utils.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.utils.js";
import { OAuth2Client } from "google-auth-library"; //for google auth api
import sendMail from "../utils/email.utils.js";
import generateTokensAndLogin from "../utils/logger.utils.js";
import jwt from "jsonwebtoken"
import dotenv from 'dotenv';
dotenv.config();



// form login
const login = async (req, res, next) => {
  try {

    const query = {};
    const { email, password, username } = req.body;
    if (email) {
        query.email = email;
    }
    if (username) {
      query.username = username;
    }

    const user = await userModel.findOne(query);

    if (!password) {
      throwErrorMessage("pls enter password", 404);
    }
    if (!user) {
      throwErrorMessage("user not found", 404);
    }
    const isCorrect = unhashPassword(password, user.password);
    if (!isCorrect) {
      throwErrorMessage("invalid login", 401);
    }
    return generateTokensAndLogin(user._id, res);
  } catch (error) {
    next(error);
  }
};


//using google to login
const googleSignInSignUp = async(req, res, next) => {
  try {
    const { credential } = req.body;
    //console.log(credential, "is the body");
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload(); //we grab the payload
    
    const { email, name} = payload; // we destructure payload from google

    const userEmailExisting = await userModel.findOne({email:email});

      if (userEmailExisting) { //if user email still exists we just log him in;
        return generateTokensAndLogin(userEmailExisting._id, res);
    }

    const newUser = await (new userModel({ email: email, OAUTH: true, username: name })).save();
    return generateTokensAndLogin(newUser._id, res);
  } catch (error) {
    next(error);
    console.log(error.message);
  }
 }

//endpoint for getting new token
const gettingNewToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.token;
   // console.log(req.cookies?.token, "is our cookie")
    if (!refreshToken) {
      throwErrorMessage("pls login", 403);
    }
    const userId = resolveToken(refreshToken);
    if (!userId) throwErrorMessage("something went wrong", 500);
    const newAccessToken = generateAccessToken(userId);

    return res.status(200).json({ newAccessToken: newAccessToken, message: "new token fetched" })
  } catch (error) {
    next(error);
  }
}

//endpoint for logging out
const logout = async (req, res, next) => {
  try {
    return res
      .status(200)
      .clearCookie("token", {
        httpOnly: true,
        path: "/", // Adjust based on how the cookie was originally set
        secure: true, // Use this if cookie was set with `secure: true`
        sameSite: "none", // Match your original settings
      })
      .json({ message: "logged out successfully" });
  } catch (error) {
    throwErrorMessage(500, "something went wrong");
    next(error);
  }
};

//endpoint for forgot password

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req?.body;
    
    if (!email || !await userModel.findOne({ email: email })) {
      return res
        .status(400)
        .json({ message: "email sent to the provided email address" });
    }
    const user = await userModel.findOne({ email: email });
     const payload = { userId: user._id };
     const options = { expiresIn: "5m" };
    const token = jwt.sign(payload, process.env.PASSWORD_RECOVERY_SECRET_KEY, options);
    
    //your frontend page to insert new password replace with your FE and /the-exact-page
    console.log(process.env.FRONT_END, "IS MY FRONT END");
    const recoveryLink = `${process.env.FRONT_END}/reset-password?token=${token}`; 

    let mailOptions = {
      from: '"EOE" <victorflawless7@gmail.com>',
      to: email,
      subject: "PASSWORD RESET",
      html: `
          <p>hi ${email.split("@")[0]}</p>
          <h1>CLICK THE LINK BELOW TO RESET PASSWORD</h1>
          <p>it expires in 5 mins</>
          <a href="${recoveryLink}" style="display: inline-block; padding: 10px 20px;   background: linear-gradient(90deg, black, red); color: white; text-decoration: none; border-radius: 5px;">
            RESET PASSWORD
          </a>
      `,
    };
    await sendMail(mailOptions) //send the email

    return res.json({ message: "email sent to the provided email address"});
  } catch (error) {
    console.log(error.message, "is the error")
    next(error)
  }
}

//endpoint for resetting password
const passwordReset = async (req, res, next) => {
  try {
    const { newPassword } = req?.body;
    const { token } = req?.query

    //console.log(newPassword, token);

    if (!newPassword || !token) {
      throw new Error('newPassword or token missing')
    }
    const decoded = jwt.verify(token, process.env.PASSWORD_RECOVERY_SECRET_KEY);
    const hashedPassword = hashPassword(newPassword);
    const user = await userModel.findByIdAndUpdate(decoded.userId, { password: hashedPassword }, { new: true });
    // console.log(decoded);
    // console.log(user);
    return res.json({message:"password reset successfully, now login"})
  } catch (error) {
    console.log(error.message);
     next(error);
  }
}

// const logStatus = async (req, res) => {
//   try {
//     const cookie = req.cookies
    
//     if (cookie?.token) {
//       const userId = resolveToken(cookie.token);
//       const { authorId } = req.query;
//       if (userId === authorId) {
//         return res
//         .status(200)
//         .json({ message: true });
//       }
//       //console.log(userId === authorId, "is if they tally")
//     }
//     return res
//       .status(404)
//       .json({ message: false });
//   } catch (error) {
//     next(error);
//   }
// }


const logStatus = async (req, res) => {
  try {
    const cookie = req.cookies
    
    if (cookie?.token) {
      const userId = resolveToken(cookie.token); //used to check if user is logged in
        return res
        .status(200)
        .json({ message: true, userId:userId });
      //console.log(userId === authorId, "is if they tally")
    }
    return res
      .status(404)
      .json({ message: false, userId:null });
  } catch (error) {
    next(error);
  }
}
const logStatus2 = async (req, res) => {
  try {
    const cookie = req.cookies
    
    if (cookie?.token) {
        return res
        .status(200)
        .json({ message: true });
      
      //console.log(userId === authorId, "is if they tally")
    }

    return res
      .status(404)
      .json({ message: false });
  } catch (error) {
    next(error);
  }
}



export {
  login,
  logout,
  logStatus,
  logStatus2,
  gettingNewToken,
  googleSignInSignUp,
  forgotPassword,
  passwordReset
};
