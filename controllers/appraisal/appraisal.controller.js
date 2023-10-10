const message = require("../../json/message.json");
const appraisalModel = require("../../models/appraisal/appraisal.model");
const userModel = require("../../models/admin/admin.model");
const roleModel = require("../../models/roles/roles.model");
const { validateEmptyFields, generateToken, hashString } = require("../../utils/utils");
const apiRes = require("../../utils/apiResponse");
let moment = require('moment')
const { sendEmail, sendNotificatonEmail } = require("../../service/mail.service")
const ObjectId = require("mongoose").Types.ObjectId
const { sendDataEmail } = require("../../service/mail.service")

module.exports = {
    createAppraisal: async (req, res) => {
        try {

            let validateMsg = validateEmptyFields(req.body, ["fullName", "email", "phone"]);
            if (validateMsg) {
                return apiRes.BAD_REQUEST(res, validateMsg);
            }

            let data = {
                ...req.body,
                builtDate: req.body.builtDate ? new Date(req.body.builtDate) : null
            }

            let checkUser = await userModel.findOne({ email: data.email })
            if (!checkUser) {

                let random = Math.random().toString(36).substring(2, 20)
                await sendEmail(data.email, data.fullName, random)
                await sendNotificatonEmail(data.fullName)

                let hashPassword = await hashString(random)

                let userRole = await roleModel.findOne({ roleName: "user" })
                await userModel.findOneAndUpdate(
                    { email: data.email },
                    {
                        $set: {
                            email: data.email,
                            userName: data.fullName,
                            password: hashPassword,
                            role: userRole._id,
                        }
                    },
                    { upsert: true, new: true }
                )
                let x = await new appraisalModel(data).save()
                let body = {
                    "Immobilienbewertung": x._doc?.appraisal,
                    "Haustyp": x._doc?.houseType,
                    "Wohnfläche": x._doc?.livingSize,
                    "Grundstücksfläche": x._doc?.areaSize,
                    "Zimmer": x._doc?.roomCount,
                    "Eigentümer": x._doc?.isOwner,
                    "Nutzung":   x._doc?.usage,
                    "Baujahr": x._doc?.builtDate,
                    "Verkauf":    x._doc?.sellingDue,
                    "PLZ":    x._doc?.location,
                    "Name":  x._doc?.fullName,
                    "E-Mail": x._doc?.email,
                    "Telefon": x._doc?.phone,
                }
                await sendDataEmail(body)
                return apiRes.OK(res, message.PASSWORD_SENT);

            } else {
                let x = await new appraisalModel(data).save()
                let body = {
                    "Immobilienbewertung": x._doc?.appraisal,
                    "Haustyp": x._doc?.houseType,
                    "Wohnfläche": x._doc?.livingSize,
                    "Grundstücksfläche": x._doc?.areaSize,
                    "Zimmer": x._doc?.roomCount,
                    "Eigentümer": x._doc?.isOwner,
                    "Nutzung":   x._doc?.usage,
                    "Baujahr": x._doc?.builtDate,
                    "Verkauf":    x._doc?.sellingDue,
                    "PLZ":    x._doc?.location,
                    "Name":  x._doc?.fullName,
                    "E-Mail": x._doc?.email,
                    "Telefon": x._doc?.phone,
                }
                await sendDataEmail(body)
                return apiRes.OK(res, message.APPRAISAL_CREATED);
            }

        } catch (error) {
            console.log("🚀 ~ file: appraisal.controller.js:23 ~ createAppraisal: ~ error", error)
            switch (error.code) {
                case 11000:
                    return apiRes.DUPLICATE_VALUE(res, message.ERROR);

                default:
                    return apiRes.CATCH_ERROR(res, error.message);
            }
        }
    },

    getAppraisal: async (req, res) => {
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
                        { fullName: { $regex: letter, $options: 'i' } },
                        { appraisal: { $regex: letter, $options: 'i' } },
                        { isOwner: { $regex: letter, $options: 'i' } },
                        { usage: { $regex: letter, $options: 'i' } },
                        { sellingDue: { $regex: letter, $options: 'i' } },
                        { houseType: { $regex: letter, $options: 'i' } },
                        { usage: { $regex: letter, $options: 'i' } },
                        { email: { $regex: letter, $options: 'i' } },
                    ]
                }
            }

            const appraisalCount = await appraisalModel.find(criteria).countDocuments()
            const getAppraisal = await appraisalModel.find(criteria)
                .sort({ createdAt: -1 })
                .skip(limit * page - limit)
                .limit(limit)

            if (getAppraisal.length) {
                return apiRes.OK(res, message.APPRAISAL_FETCHED, { getAppraisal, count: appraisalCount });
            } else {
                return apiRes.OK(res, message.APPRAISAL_NOT_FOUND);
            }

        } catch (error) {
            console.log("🚀 ~ file: appraisal.controller.js:60 ~ getAppraisal: ~ error", error)
            switch (error.code) {
                case 11000:
                    return apiRes.DUPLICATE_VALUE(res, message.ERROR);

                default:
                    return apiRes.CATCH_ERROR(res, error.message);
            }
        }
    },

    updateAppraisal: async (req, res) => {
        try {

            let { _id } = req.query

            const appraisalExists = await appraisalModel.findOne({ _id: _id })
            if (!appraisalExists) {
                return apiRes.BAD_REQUEST(res, message.APPRAISAL_NOT_FOUND);
            }

            let appraisal = await appraisalModel.findOneAndUpdate({ _id: appraisalExists._id }, { $set: req.body }, { new: true })
            return apiRes.OK(res, message.APPRAISAL_UPDATED, appraisal);


        } catch (error) {
            console.log("🚀 ~ file: appraisal.controller.js:98 ~ updateAppraisal: ~ error", error)
            switch (error.code) {
                case 11000:
                    return apiRes.DUPLICATE_VALUE(res, message.ERROR);

                default:
                    return apiRes.CATCH_ERROR(res, error.message);
            }
        }
    },

    deleteAppraisal: async (req, res) => {
        try {

            let { _id } = req.query

            const appraisalExists = await appraisalModel.findOne({ _id: _id })
            if (!appraisalExists) {
                return apiRes.BAD_REQUEST(res, message.APPRAISAL_NOT_FOUND);
            }

            await appraisalModel.findOneAndDelete({ _id: appraisalExists._id })
            return apiRes.OK(res, message.APPRAISAL_DELETED, {});


        } catch (error) {
            console.log("🚀 ~ file: appraisal.controller.js:124 ~ deleteAppraisal: ~ error", error)
            switch (error.code) {
                case 11000:
                    return apiRes.DUPLICATE_VALUE(res, message.ERROR);

                default:
                    return apiRes.CATCH_ERROR(res, error.message);
            }
        }
    }

};
