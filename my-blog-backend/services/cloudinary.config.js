    import { v2 as cloudinary } from 'cloudinary';
    import dotenv from 'dotenv';
    dotenv.config();
    import fs from 'fs/promises';

//     console.log('Cloudinary Config:', {
//     CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
//     API_KEY: process.env.CLOUDINARY_API_KEY, // Don't log actual key
//     API_SECRET: process.env.CLOUDINARY_API_SECRET
// });
    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

    const cloudinaryUploader = async(pathToFile, profilePics)=>{
        try {
            const result =  await cloudinary.uploader.upload(pathToFile,{folder:profilePics});
            await fs.unlink(pathToFile);
            return result;
        } catch (error) {
            await fs.unlink(pathToFile);
            console.log("something happened in cloudinary endpoint");
            console.log(error.message);
        }
    }



    
 
    export {cloudinary, cloudinaryUploader};