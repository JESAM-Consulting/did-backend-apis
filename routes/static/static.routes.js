const express = require("express");
const router = express.Router();
const { auth, authPermissions } = require("../../middleware/auth");
const { createStatic, getStatic, getStaticAll, updateStatic, deletestatic } = require("../../controllers/static/static.controller");
const { upload, uploadError } = require("../../service/aws/s3bucket")

const uploadImage = upload.array('image', 1)

router.post("/add-static", auth, authPermissions(), uploadImage, uploadError, createStatic);
router.get("/get-static", auth, getStatic);
router.get("/get-all-static", getStaticAll);
router.put("/update-static", auth, authPermissions(), uploadImage, uploadError, updateStatic);
router.delete("/delete-static", auth, authPermissions(), deletestatic);

module.exports = router;
