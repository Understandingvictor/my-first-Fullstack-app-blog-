
import {cloudinary, cloudinaryUploader} from "../services/cloudinary.config.js";


const singlePics=async(req, res, next)=>{
    try {
        
        if(!req.file){
            return res.status(400).json({
                message:"file not found",
                success:false
            })                      
        }
      
        const result = await cloudinaryUploader(req.file.path, 'profile_pics');
        console.log(result,' is the rresult');
        return res.json({message:result});
    } catch (error) {
        console.log(error.message, "error happened here")
        next(error.message);
    }

}


const dripPics=async(req, res, next)=>{
    try {

        if(!req.files){
            return res.send("files not uploaded");
        }
        console.log(req.files);
        //console.log(req.body); //used to output the text part
        console.log(req.files.length, " is the number of pictures");
        return res.json({message:req.body});
    } catch (error) {
        console.log(error.message, "error happened here")
        next(error.message);
    }
}

const productPics=async(req, res)=>{
    try {
        
        if(!req.files){
            return res.send("files not uploaded");
        }
        console.log(req.files);
        //console.log(req.body); //used to output the text part
        console.log(req.files.length, " is the number of pictures");
        return res.json({message:req.body});
    } catch (error) {
        console.log(error.message, "error happened here");
        next(error.message);
    }
}
export {singlePics, dripPics, productPics};