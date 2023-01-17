const express = require("express");
const router = express.Router();
const { auth, authPermissions } = require("../../middleware/auth");
const {addEmail, getEmail, deleteEmail} = require("../../controllers/contact/dropEmail.controller");

router.post("/add-mail", addEmail);
router.get("/get-mail", auth, authPermissions(), getEmail);
router.delete("/remove-mail", auth, authPermissions(), deleteEmail);

module.exports = router;
