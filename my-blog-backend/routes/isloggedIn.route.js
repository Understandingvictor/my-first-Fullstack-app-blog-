import express from "express";
const route = express.Router();
import verifyUser from "../middlewares/auth.middleware.js";
import { isLoggedIn } from "../controllers/isLoggedinAuth.js";

route.get("/isloggedIn", verifyUser, isLoggedIn);

export default route;