const express = require("express");
const router = express.Router();
const { auth, authPermissions } = require("../../middleware/auth");
const { addContact, getContact, updateContact, deleteContact } = require("../../controllers/contact/contact.controller");

const { upload, uploadError } = require("../../service/aws/s3bucket")
const uploadImage = upload.array('propertyImage', 10)

router.post("/add-contact", addContact);
router.get("/get-contact", auth, authPermissions(), getContact);
router.delete("/remove-contact", auth, authPermissions(), deleteContact);

module.exports = router;
