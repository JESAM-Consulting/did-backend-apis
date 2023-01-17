const express = require("express");
const router = express.Router();
const { auth, authPermissions } = require("../../middleware/auth");
const { createCompany, getCompany, updateCompany, deleteCompamy } = require("../../controllers/company/company.controller");

const { upload } = require("../../service/aws/s3bucket")
const uploadImage = upload.array('userImage', 20)

router.post("/list-company", auth, authPermissions(), uploadImage, createCompany);
router.get("/get-company", getCompany);
router.put("/edit-company", auth, uploadImage, authPermissions(), updateCompany);
router.delete("/remove-company", auth, authPermissions(), deleteCompamy);

module.exports = router;
