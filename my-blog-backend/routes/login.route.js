import express from "express"
import {
    login,
    logout,
    logStatus,
    logStatus2,
    gettingNewToken,
    googleSignInSignUp,
    forgotPassword,
    passwordReset
} from "../controllers/login.controller.js";

import {body} from 'express-validator';
const route = express.Router()

route.post("/login", body('email').isEmpty().isEmail(),login); //for logging in
route.post("/OAUTH", googleSignInSignUp); //for logging in
route.post("/logout", logout);//for logging out
route.post("/forgotPassword", forgotPassword);// for forgottwen password page
route.post("/passwordReset", passwordReset);// for forgottwen password page
route.post("/logStatus", logStatus);//for checking log status;
route.post("/logStatus2", logStatus2);//for checking log status;
route.post("/gettingNewToken", gettingNewToken); //for getting  new accesstoken

export default route;