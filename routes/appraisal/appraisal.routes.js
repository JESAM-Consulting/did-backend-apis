const express = require("express");
const router = express.Router();
const { auth, authPermissions } = require("../../middleware/auth");
const { createAppraisal, getAppraisal, deleteAppraisal } = require("../../controllers/appraisal/appraisal.controller");

router.post("/add-appraisal", createAppraisal);
router.get("/get-appraisal", auth, getAppraisal);
router.delete("/remove-appraisal", auth, authPermissions(), deleteAppraisal);

module.exports = router;
