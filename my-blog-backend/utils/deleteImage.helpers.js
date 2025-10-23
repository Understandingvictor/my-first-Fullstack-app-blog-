import fs from "fs";
import path from "path"
import { fileURLToPath } from "url" 

const __filename = fileURLToPath(import.meta.url); //grabs this module's full url usually file:///C:/Users

const __dirname = path.dirname(__filename) // gets the directory part of that path


// console.log(__filename);
// console.log(__dirname);

const deleteImages = (fileToDelete, folderToDeleteFrom) => {
    try {
        const folderPath = path.resolve(__dirname, "..", folderToDeleteFrom);

        fs.unlink(path.join(folderPath, fileToDelete), error => {
            if (error) return null;
        });
       // console.log(folderPath, "is the folderpath");
        // fs.readdir(folderPath, (error, files) => { //read through the folder and covert it content to array of files
        //     if (error) {
        //         console.log(error.message);
        //         return;
        //     }
        //     for (const file of files) {
        //         //f (file === filetoKeep) continue;
        //         fs.unlink(path.join(folderPath, file), error => {
        //             return;
        //         })
        //     }
        //     console.log("files deleted successfully except file to keep");
        //     return true;
        // })
       // console.log("files deleted successfully except file to keep");
        return true
    } catch (error) {
        console.log("error happened here in handl;er that deletes images")
        console.log(error.message);
    }
}
export default deleteImages;