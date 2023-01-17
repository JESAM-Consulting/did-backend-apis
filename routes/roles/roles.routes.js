const express = require("express");
const router = express.Router();
const { auth, authPermissions } = require("../../middleware/auth");
const { createRole } = require("../../controllers/roles/roles.controller");

router.post("/create", createRole);

module.exports = router;
