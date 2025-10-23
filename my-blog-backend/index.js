import express, { application, text } from "express";
import cors from 'cors'
import cookieParser from "cookie-parser";
import postRoute from './routes/post.route.js'
import userRoute from './routes/user.route.js'
import authRoute from './routes/isloggedIn.route.js'
import uploadsRoute from './routes/formAndUpload.routes.js'
import logRoute from './routes/login.route.js'
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
import path from "path";
import { fileURLToPath } from "url";

// recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const app = express();
const port = process.env.PORT || 8000;

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
.connect(process.env.DB_STRING)
.then(()=>console.log('database active'))
.catch((error)=>console.log('database error', error.message));

app.use(cors({
    origin: process.env.FRONT_END,
    credentials: true
}));



app.use(express.json());
//app.use(express.text({type:['text/plain', 'text/html', 'application/javascript', 'application/xml']}));
//app.use(express.urlencoded());
app.use(cookieParser());
app.use(postRoute);
app.use(userRoute);
app.use(uploadsRoute);
app.use(authRoute);
app.use(logRoute);

app.use((error, req, res, next)=>{ //universal error handling middleware.
    return res
    .status(error.status||501)
    .json({message:error.message || "something went wrong"});
})

app.listen(port,  () => {
    console.log(`app is running on port ${port}`);
})