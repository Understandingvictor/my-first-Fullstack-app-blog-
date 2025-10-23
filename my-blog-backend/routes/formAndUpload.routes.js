import express from 'express';
import { singlePics, dripPics, productPics } from '../controllers/uploads.controller.js';
import {upload, multipleFilesField} from '../middlewares/uploads.middleware.js';
const route = express.Router();
const multiplePicsAndField = multipleFilesField('product1', 'product2');


route.post('/profilePic', upload.single('profilePics'), singlePics );
route.post('/multiplePics', upload.array('drips', 3), dripPics );
route.post('/multiplePicsAndFields', multiplePicsAndField, dripPics );

export default route;