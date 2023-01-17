const express = require("express");
const router = express.Router();
const { auth, authPermissions } = require("../../middleware/auth");
const { createProperty, getProperty, updateProperty, deleteProperty, pushImage, removeImage } = require("../../controllers/property/property.controller");

const { upload, uploadError } = require("../../service/aws/s3bucket")
const uploadImage = upload.array('propertyImage', 20)

router.post("/list-property", auth, authPermissions(), uploadImage, createProperty);
router.get("/get-property", getProperty);
router.put("/edit-property", auth, uploadImage, authPermissions(), updateProperty);
router.put("/remove-property", auth, authPermissions(), deleteProperty);
router.put("/push-image", auth, uploadImage, authPermissions(), pushImage);
router.put("/remove-image", auth, uploadImage, authPermissions(), removeImage);

// router.delete("/remove-property", auth, authPermissions(), deleteProperty);,

module.exports = router;
