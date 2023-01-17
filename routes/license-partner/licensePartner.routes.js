const express = require("express");
const router = express.Router();
const { auth, authPermissions } = require("../../middleware/auth");
const { addlicensePartner, getLicensePartner, deleteLicensePartner } = require("../../controllers/license-partner/licensePartner.controller");

router.post("/add-license-partner", addlicensePartner);
router.get("/get-license-partner", auth, getLicensePartner);
router.delete("/remove-license-partner", auth, authPermissions(), deleteLicensePartner);

module.exports = router;
