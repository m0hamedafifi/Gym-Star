var multer = require("multer");
const path = require("path");
const utility = require("./utility");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    cb(
      null,
      file.fieldname + "-" + utility.dateFormat().replace(/[- :]/g, "_") + ext
    );
  },
});

var upload = multer({ storage: storage });

module.exports = upload;
