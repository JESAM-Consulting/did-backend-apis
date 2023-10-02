const message = require("../../json/message.json");
const roleModel = require("../../models/roles/roles.model");
const { validateEmptyFields } = require("../../utils/utils");
const apiRes = require("../../utils/apiResponse");

module.exports = {
  createRole: async (req, res) => {
    try {
      let { roleName, description } = req.body;
      let validateMsg = validateEmptyFields(req.body, ["roleName", "description",]);
      if (validateMsg) {
        return apiRes.BAD_REQUEST(res, validateMsg);
      }

      let data = await new roleModel({
        roleName: roleName,
        description: description,
      }).save();

      return apiRes.OK(res, message.ROLE_CREATED, data);

    } catch (error) {
      console.log("🚀 ~ file: roles.controller.js:23 ~ createRole: ~ error", error)
      switch (error.code) {
        case 11000:
          return apiRes.DUPLICATE_VALUE(res, message.ROLE_ALREADY_EXIST);

        default:
          return apiRes.CATCH_ERROR(res, error.message);
      }
    }
  },
};
