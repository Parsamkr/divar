const multer = require("multer");
const fs = require("fs");
const path = require("path");
const createHttpError = require("http-errors");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdirSync(path.join(process.cwd() + "public" + "upload"), {
      recursive: true,
    });
    cb(null, "public/upload");
  },
  filename: function (req, file, cb) {
    const whiteListFormat = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/webp",
    ];
    if (whiteListFormat.includes(file.mimetype)) {
      const ext = path.extname(file.originalname);
      const fileName = new Date().getTime().toString() + ext;
      cb(null, fileName);
    } else {
      cb(new createHttpError.BadRequest("format of pictures are wrong"));
    }
  },
});
const upload = multer({ storage, limits: { fileSize: 3 * 1000 * 1000 } });
module.exports = upload;
