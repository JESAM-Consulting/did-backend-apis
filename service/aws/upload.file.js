const express = require("express");
const router = express.Router();
const { upload, deleteImage } = require("./storeImages");
const auth = require("../../middleware/auth");
const enums = require("../../json/enums.json");
const messages = require("../../json/message.json");

// const uploadImage = upload.array( "image", 10 )

router.post("/image-upload", auth, uploadImage, function (req, res) {
  let response = [];
  if (req.files instanceof Array == false) {
    return res.status(enums.HTTP_CODES.FORBIDDEN).send({
      status: false,
      message: messages.imageTypeError,
      error: "field must be an array",
    });
  }

  for (var i = 0; i < req.files.length; i++) {
    response.push(req.files[i].location);
  }
  return res.send({ imageUrl: response });
});

module.exports = router;
