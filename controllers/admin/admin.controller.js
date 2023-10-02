const adminModel = require("../../models/admin/admin.model");
const roleModel = require("../../models/roles/roles.model");
const apiRes = require("../../utils/apiResponse");

const { validateEmptyFields, compareString, generateToken, hashString } = require("../../utils/utils");

const message = require("../../json/message.json");
const { sendEmail } = require("../../service/mail.service");
const validator = require("validator");

module.exports = exports = {
    signUp: async (req, res) => {
        try {
            let { email, role } = req.body;

            if (!validator.isEmail(email)) {
                return apiRes.BAD_REQUEST(res, message.INVALID_EMAIL);
            }

            let isExistAdmin = await adminModel.findOne({
                email: email,
            });

            if (isExistAdmin) {
                return apiRes.BAD_REQUEST(res, message.USER_ALREADY_EXIST);
            }

            let roleData = await roleModel.findOne({ _id: role })
            if (role != roleData._id) {
                return apiRes.BAD_REQUEST(res, message.INVALID_ROLE);
            }

            const adminData = await adminModel.create(req.body)

            return apiRes.OK(res, message.USER_CREATED, adminData);
        } catch (error) {
            console.log("🚀 ~ file: admin.controller.js:54 ~ signUp: ~ error", error)
            apiRes.CATCH_ERROR(res, error.message);
        }
    },

    login: async (req, res) => {
        try {
            let { email, password } = req.body;

            let validateMsg = validateEmptyFields(req.body, ["email", "password"]);
            if (validateMsg) {
                return apiRes.BAD_REQUEST(res, validateMsg);
            }

            let adminData = await adminModel.findOne({ email: email, isActive: true, }).populate({ path: "role", select: "roleName" })
            if (!adminData) {
                return apiRes.BAD_REQUEST(res, message.USER_NOT_ACTIVE);
            }

            let comparePassword = await compareString(password, adminData.password)
            if (!comparePassword) {
                return apiRes.BAD_REQUEST(res, message.INVALID_CREDS);
            }

            adminData._doc.accessToken = generateToken({
                userId: adminData._id,
                email: adminData.email,
                role: adminData.role.roleName,
            });
            return apiRes.OK(res, message.LOGIN_SUCCESS, adminData);


        } catch (error) {
            console.log("🚀 ~ file: admin.controller.js:145 ~ login: ~ error", error)
            apiRes.CATCH_ERROR(res, error.message);
        }
    },
};
