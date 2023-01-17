const message = require("../../json/message.json");
const managePropModel = require("../../models/manage-property/manageProperty.model");
const userModel = require("../../models/admin/admin.model");
const roleModel = require("../../models/roles/roles.model");
const { validateEmptyFields, generateToken, hashString } = require("../../utils/utils");
const apiRes = require("../../utils/apiResponse");
let moment = require('moment')
const { sendEmail } = require("../../service/mail.service")
const ObjectId = require("mongoose").Types.ObjectId

module.exports = {
    addManageProperty: async (req, res) => {
        try {

            let validateMsg = validateEmptyFields(req.body, ["fullName", "email", "phone"]);
            if (validateMsg) {
                return apiRes.BAD_REQUEST(res, validateMsg);
            }

            let manageProp = new managePropModel(req.body)

            let checkUser = await userModel.findOne({ email: manageProp.email })

            if (!checkUser) {
                let random = Math.random().toString(36).substring(2, 20)
                await sendEmail(manageProp.email, manageProp.fullName, random)

                let hashPassword = await hashString(random)

                let userRole = await roleModel.findOne({ roleName: "user" })
                await userModel.findOneAndUpdate(
                    { email: manageProp.email },
                    {
                        $set: {
                            email: manageProp.email,
                            userName: manageProp.fullName,
                            password: hashPassword,
                            role: userRole._id,
                        }
                    },
                    { upsert: true, new: true }
                )
                await manageProp.save()
                return apiRes.OK(res, message.PASSWORD_SENT);

            } else {
                await manageProp.save()
                return apiRes.OK(res, message.MANAGE_PROPERTY_CREATED);
            }

        } catch (error) {
            console.log("🚀 ~ file: manageProp.controller.js:23 ~ addManageProperty: ~ error", error)
            switch (error.code) {
                case 11000:
                    return apiRes.DUPLICATE_VALUE(res, message.ERROR);

                default:
                    return apiRes.CATCH_ERROR(res, error.message);
            }
        }
    },

    getManageProperty: async (req, res) => {
        try {
            let { _id, letter } = req.query

            // pagination
            const page = parseInt(req.query.page) || 1
            const limit = parseInt(req.query.limit) || 10

            let criteria = {}
            if (_id) criteria._id = ObjectId(_id)
            if (req.userData.role.roleName == "user") criteria.email = req.userData.email

            if (letter) {
                criteria = {
                    $or: [
                        { currentUsage: { $regex: letter, $options: 'i' } },
                        { email: { $regex: letter, $options: 'i' } },
                        { fullName: { $regex: letter, $options: 'i' } },
                        { manageType: { $regex: letter, $options: 'i' } },
                    ]
                }
            }

            const managePropCount = await managePropModel.find(criteria).countDocuments()
            const getManageProperty = await managePropModel.find(criteria)
                .sort({ createdAt: -1 })
                .skip(limit * page - limit)
                .limit(limit)

            if (getManageProperty.length) {
                return apiRes.OK(res, message.MANAGE_PROPERTY_FETCHED, { getManageProperty, count: managePropCount });
            } else {
                return apiRes.OK(res, message.MANAGE_PROPERTY_NOT_FOUND);
            }


        } catch (error) {
            console.log("🚀 ~ file: manageProp.controller.js:60 ~ getManageProperty: ~ error", error)
            switch (error.code) {
                case 11000:
                    return apiRes.DUPLICATE_VALUE(res, message.ERROR);

                default:
                    return apiRes.CATCH_ERROR(res, error.message);
            }
        }
    },

    updateManageProperty: async (req, res) => {
        try {

            let { _id } = req.query

            const appraisalExists = await managePropModel.findOne({ _id: _id })
            if (!appraisalExists) {
                return apiRes.BAD_REQUEST(res, message.MANAGE_PROPERTY_NOT_FOUND);
            }

            let appraisal = await managePropModel.findOneAndUpdate({ _id: appraisalExists._id }, { $set: req.body }, { new: true })
            return apiRes.OK(res, message.MANAGE_PROPERTY_UPDATED, appraisal);

        } catch (error) {
            console.log("🚀 ~ file: manageProperty.controller.js:98 ~ updateManageProperty: ~ error", error)
            switch (error.code) {
                case 11000:
                    return apiRes.DUPLICATE_VALUE(res, message.ERROR);

                default:
                    return apiRes.CATCH_ERROR(res, error.message);
            }
        }
    },

    deleteManageProperty: async (req, res) => {
        try {

            let { _id } = req.query

            const managePropExists = await managePropModel.findOne({ _id: _id })
            if (!managePropExists) {
                return apiRes.BAD_REQUEST(res, message.MANAGE_PROPERTY_NOT_FOUND);
            }

            await managePropModel.findOneAndDelete({ _id: managePropExists._id })
            return apiRes.OK(res, message.MANAGE_PROPERTY_DELETED, {});


        } catch (error) {
            console.log("🚀 ~ file: manageProp.controller.js:124 ~ deleteManageProperty: ~ error", error)
            switch (error.code) {
                case 11000:
                    return apiRes.DUPLICATE_VALUE(res, message.ERROR);

                default:
                    return apiRes.CATCH_ERROR(res, error.message);
            }
        }
    }

};
