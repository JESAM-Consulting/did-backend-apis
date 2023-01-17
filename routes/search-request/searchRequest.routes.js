const express = require("express");
const router = express.Router();
const { auth, authPermissions } = require("../../middleware/auth");
const { createSearchReq, getSearchReq, deleteSearchReq } = require("../../controllers/search-request/searchRequest.controller");

router.post("/add-search-query", createSearchReq);
router.get("/get-search-query", auth, getSearchReq);
router.delete("/remove-search-query", auth, authPermissions(), deleteSearchReq);

module.exports = router;
