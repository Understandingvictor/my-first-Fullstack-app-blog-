import multer from 'multer';

const upload = multer({dest:'./uploads'});

const multipleFilesField = (name1, name2)=>{
  try {
    const multiplePicsAndField = upload.fields([
      { name: name1, maxCount: 1 },
      { name: name2, maxCount: 1 },
    ]); //for multiple pics on different field

    return multiplePicsAndField;
    
  } catch (error) {
    console.log('something happened in here multer ')
  }
}

export {multipleFilesField, upload };