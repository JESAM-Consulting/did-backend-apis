const userModel = require("../models/admin/admin.model");
const { ROLE } = require("../json/enums.json");
const apiRes = require("../utils/apiResponse");
const message = require("../json/message.json");
const jwt = require("jsonwebtoken");

module.exports = {
  auth: async (req, res, next, isTokenRequired = true) => {
    try {
      const token = req.header("x-auth-token");
      if ((!token || token === "null") && !isTokenRequired) return next();
      if ((!token || token === "null") && isTokenRequired) {
        return apiRes.BAD_REQUEST(res, message.TOKEN_NOT_PROVIDED);
      }
      let decoded = jwt.verify(token, process.env.JWT_SECRET);

      let userData = await userModel
        .findOne({ _id: decoded.userId, isActive: true })
        .populate({
          path: "role",
          select: "roleName",
        })
        .select("-createdAt -updatedAt -password");

      if (!userData) {
        return apiRes.UNAUTHORIZED(res, message.INVALID_TOKEN);
      }
      req.userData = userData;
      next();
    } catch (error) {
      console.log("🚀 ~ file: auth.js:31 ~ auth: ~ error", error)
      return apiRes.CATCH_ERROR(res, error.message);
    }
  },

  authPermissions: (...permissions) => {
    return (req, res, next) => {
      try {
        const { userData } = req;
        const { roleName } = userData.role;
        if (roleName === ROLE.ADMIN) {
          next();
        } else {
          if (permissions.includes(roleName)) {
            next();
          } else {
            return apiRes.UNAUTHORIZED(res, message.INVALID_TOKEN);
          }
        }
      } catch (error) {
        console.log("authPermissions error", error);
        return apiRes.CATCH_ERROR(res, error.message);
      }
    };
  },
};
