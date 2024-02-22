var multer = require("multer");
const path = require("path");
const utility = require("./utility");




let counter = 1;
let storage = multer.diskStorage({
  destination:(req, file, cb) => {
    cb(null, "uploads/");

  },
  filename: (req, file, cb) => {
    let ext = path.extname(file.originalname);

    cb(
      null,
      `${file.mimetype.replace("/", "-")}-${utility
        .dateFormat()
        .replace(/[- :]/g, "_")}-${counter}${ext}` //Appending extension to the name of the image
    );
    
    counter++;
  },
});




let upload = multer({ storage: storage });

module.exports = upload;
