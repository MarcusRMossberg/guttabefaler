const imageRouter = require("express").Router();
const { reset } = require("nodemon");
const upload = require("../services/ImageUpload");
const singleUpload = upload.single("image");

imageRouter.post("/", function (req, res) {
  singleUpload(req, res, function (err) {
    if (err) {
      return res.json({
        success: false,
        errors: {
          title: "Image Upload Error",
          detail: err.message,
          error: err,
        },
      });
    }
    res.json(req.file.location);
  });
});
module.exports = imageRouter;
