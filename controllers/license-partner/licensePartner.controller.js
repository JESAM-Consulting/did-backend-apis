const message = require("../../json/message.json");
const licensePartnerModel = require("../../models/licence-partner/licensePartner.model");
const userModel = require("../../models/admin/admin.model");
const roleModel = require("../../models/roles/roles.model");
const { validateEmptyFields, generateToken, hashString } = require("../../utils/utils");
const apiRes = require("../../utils/apiResponse");
let moment = require('moment')
const { sendEmail, sendNotificatonEmail } = require("../../service/mail.service")
const ObjectId = require("mongoose").Types.ObjectId
const { sendDataEmail } = require("../../service/mail.service")


module.exports = {
    addlicensePartner: async (req, res) => {
        try {

            let validateMsg = validateEmptyFields(req.body, ["fullName", "email", "phone"]);
            if (validateMsg) {
                return apiRes.BAD_REQUEST(res, validateMsg);
            }

            let licensePartner = new licensePartnerModel(req.body)

            let checkUser = await userModel.findOne({ email: licensePartner.email })
            if (!checkUser) {
                let random = Math.random().toString(36).substring(2, 20)
                await sendEmail(licensePartner.email, licensePartner.fullName, random)
                await sendNotificatonEmail(licensePartner.fullName)

                let hashPassword = await hashString(random)

                let userRole = await roleModel.findOne({ roleName: "user" })
                await userModel.findOneAndUpdate(
                    { email: licensePartner.email },
                    {
                        $set: {
                            email: licensePartner.email,
                            userName: licensePartner.fullName,
                            password: hashPassword,
                            role: userRole._id,
                        }
                    },
                    { upsert: true, new: true }
                )
                let x = await licensePartner.save()
                await sendDataEmail(x._doc)
                return apiRes.OK(res, message.PASSWORD_SENT);
            } else {
                let x = await licensePartner.save()
                await sendDataEmail(x._doc)
                return apiRes.OK(res, message.LICENSE_PARTNER_CREATED);
            }

        } catch (error) {
            console.log("🚀 ~ file: licensePartner.controller.js:23 ~ addlicensePartner: ~ error", error.message)
            switch (error.code) {
                case 11000:
                    return apiRes.DUPLICATE_VALUE(res, message.ERROR);

                default:
                    return apiRes.CATCH_ERROR(res, error.message);
            }
        }
    },

    getLicensePartner: async (req, res) => {
        try {
            let { _id, letter } = req.query

            // pagination
            const page = parseInt(req.query.page) || 1
            const limit = parseInt(req.query.limit) || 10

            let criteria = {}
            if (_id) { criteria._id = ObjectId(_id) }
            if (req.userData.role.roleName == "user") criteria.email = req.userData.email

            if (letter) {
                criteria = {
                    $or: [
                        { fullName: { $regex: letter, $options: 'i' } },
                        { licensePartner: { $regex: letter, $options: 'i' } },
                        { usage: { $regex: letter, $options: 'i' } },
                        { email: { $regex: letter, $options: 'i' } },
                    ]
                }
            }
            const licensePartnerCount = await licensePartnerModel.find(criteria).countDocuments()
            const getLicensePartner = await licensePartnerModel.find(criteria)
                .sort({ createdAt: -1 })
                .skip(limit * page - limit)
                .limit(limit)

            if (getLicensePartner.length) {
                return apiRes.OK(res, message.LICENSE_PARTNER_FETCHED, { getLicensePartner, count: licensePartnerCount });
            } else {
                return apiRes.OK(res, message.LICENSE_PARTNER_NOT_FOUND);
            }


        } catch (error) {
            console.log("🚀 ~ file: licensePartner.controller.js:60 ~ getLicensePartner: ~ error", error)
            switch (error.code) {
                case 11000:
                    return apiRes.DUPLICATE_VALUE(res, message.ERROR);

                default:
                    return apiRes.CATCH_ERROR(res, error.message);
            }
        }
    },

    updateLicensePartner: async (req, res) => {
        try {

            let { _id } = req.query

            const licensePartnerExists = await licensePartnerModel.findOne({ _id: _id })
            if (!licensePartnerExists) {
                return apiRes.BAD_REQUEST(res, message.APPRAISAL_NOT_FOUND);
            }

            let licensePartner = await licensePartnerModel.findOneAndUpdate({ _id: licensePartnerExists._id }, { $set: req.body }, { new: true })
            return apiRes.OK(res, message.LICENSE_PARTNER_UPDATED, licensePartner);


        } catch (error) {
            console.log("🚀 ~ file: licensePartner.controller.js:98 ~ updateLicensePartner: ~ error", error)
            switch (error.code) {
                case 11000:
                    return apiRes.DUPLICATE_VALUE(res, message.ERROR);

                default:
                    return apiRes.CATCH_ERROR(res, error.message);
            }
        }
    },

    deleteLicensePartner: async (req, res) => {
        try {

            let { _id } = req.query

            const licensePartnerExists = await licensePartnerModel.findOne({ _id: _id })
            if (!licensePartnerExists) {
                return apiRes.BAD_REQUEST(res, message.LICENSE_PARTNER_NOT_FOUND);
            }

            await licensePartnerModel.findOneAndDelete({ _id: licensePartnerExists._id })
            return apiRes.OK(res, message.LICENSE_PARTNER_DELETED, {});


        } catch (error) {
            console.log("🚀 ~ file: licensePartner.controller.js:124 ~ getLicensePartner: ~ error", error)
            switch (error.code) {
                case 11000:
                    return apiRes.DUPLICATE_VALUE(res, message.ERROR);

                default:
                    return apiRes.CATCH_ERROR(res, error.message);
            }
        }
    }

};
