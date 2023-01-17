const express = require("express");
const router = express.Router();
const { auth, authPermissions } = require("../../middleware/auth");
const { addManageProperty, getManageProperty, deleteManageProperty } = require("../../controllers/manage-property/manageProperty.controller");

router.post("/add-manage-property", addManageProperty);
router.get("/get-manage-property", auth, getManageProperty);
router.delete("/remove-manage-property", auth, authPermissions(), deleteManageProperty);

module.exports = router;
