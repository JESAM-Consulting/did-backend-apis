const message = require("../../json/message.json");
const searchReqModel = require("../../models/search-request/searchRequest.model");

const roleModel = require("../../models/roles/roles.model");
const userModel = require("../../models/admin/admin.model");

const { validateEmptyFields, generateToken, hashString } = require("../../utils/utils");
const apiRes = require("../../utils/apiResponse");
let moment = require('moment')
const { sendEmail, sendNotificatonEmail } = require("../../service/mail.service")
const ObjectId = require("mongoose").Types.ObjectId
const { sendDataEmail } = require("../../service/mail.service")


module.exports = {
    createSearchReq: async (req, res) => {
        try {

            let validateMsg = validateEmptyFields(req.body, ["fullName", "email", "phone"]);
            if (validateMsg) {
                return apiRes.BAD_REQUEST(res, validateMsg);
            }

            let data = {
                ...req.body,
                searchDate: req.body.searchDate ? new Date(req.body.searchDate) : null,
            }
            let searchReq = new searchReqModel(data)

            let checkUser = await userModel.findOne({ email: searchReq.email })
            if (!checkUser) {

                let random = Math.random().toString(36).substring(2, 20)
                let hashPassword = await hashString(random)

                await sendEmail(searchReq.email, searchReq.fullName, random)
                await sendNotificatonEmail(searchReq.fullName)

                let userRole = await roleModel.findOne({ roleName: "user" })
                await userModel.findOneAndUpdate(
                    { email: searchReq.email },
                    {
                        $set: {
                            email: searchReq.email,
                            userName: searchReq.fullName,
                            password: hashPassword,
                            role: userRole._id,
                        }
                    },
                    { upsert: true, new: true }
                )
                let x = await searchReq.save()
                let body = {
                    "Suchanfrage": x._doc?.searchRequest,
                    "Stadt": x._doc?.city,
                    "Bundesland": x._doc?.state,
                    "Objekt mieten": x._doc?.propertyRent,
                    "Objekt kaufen": x._doc?.propertyBuy,
                    "max. Mietpreis": x._doc?.maxRentPrice,
                    "Grundstücksfläche": x._doc?.areaSize,
                    "Zimmer": x._doc?.roomCount,
                    "max. Kaufpreis": x._doc?.maxBuyPrice,
                    "Suche nach Datum": moment(new Date(x._doc?.searchDate)).format("DD-MM-YYYY"),
                    "Sonstiges": x._doc?.other,
                    "Name": x._doc?.fullName,
                    "E-Mail": x._doc?.email,
                    "Telefon": x._doc?.phone,
                }
                await sendDataEmail(body)
                return apiRes.OK(res, message.PASSWORD_SENT);

            } else {
                let x = await searchReq.save()
                let body = {
                    "Suchanfrage": x._doc?.searchRequest,
                    "Stadt": x._doc?.city,
                    "Bundesland": x._doc?.state,
                    "Objekt mieten": x._doc?.propertyRent,
                    "Objekt kaufen": x._doc?.propertyBuy,
                    "max. Mietpreis": x._doc?.maxRentPrice,
                    "Grundstücksfläche": x._doc?.areaSize,
                    "Zimmer": x._doc?.roomCount,
                    "max. Kaufpreis": x._doc?.maxBuyPrice,
                    "Suche nach Datum": moment(new Date(x._doc?.searchDate)).format("YYYY"),
                    "Sonstiges": x._doc?.other,
                    "Name": x._doc?.fullName,
                    "E-Mail": x._doc?.email,
                    "Telefon": x._doc?.phone,
                }
                await sendDataEmail(body)
                return apiRes.OK(res, message.SEARCH_REQUEST_CREATED);
            }


        } catch (error) {
            switch (error.code) {
                case 11000:
                    return apiRes.DUPLICATE_VALUE(res, message.ERROR);

                default:
                    return apiRes.CATCH_ERROR(res, error.message);
            }
        }
    },

    getSearchReq: async (req, res) => {
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
                        { email: { $regex: letter, $options: 'i' } }
                    ]
                }
            }

            const searchCount = await searchReqModel.find(criteria).countDocuments()
            const getSearchReq = await searchReqModel.find(criteria)
                .sort({ createdAt: -1 })
                .skip(limit * page - limit)
                .limit(limit)

            if (getSearchReq.length) {
                return apiRes.OK(res, message.SEARCH_REQUEST_FETCHED, { getSearchReq, count: searchCount });
            } else {
                return apiRes.OK(res, message.SEARCH_REQUEST_NOT_FOUND);
            }


        } catch (error) {
            switch (error.code) {
                case 11000:
                    return apiRes.DUPLICATE_VALUE(res, message.ERROR);

                default:
                    return apiRes.CATCH_ERROR(res, error.message);
            }
        }
    },

    updateSearchReq: async (req, res) => {
        try {

            let { _id } = req.query

            const requestExists = await searchReqModel.findOne({ _id: _id })
            if (!requestExists) {
                return apiRes.BAD_REQUEST(res, message.SEARCH_REQUEST_NOT_FOUND);
            }

            let searchReq = await searchReqModel.findOneAndUpdate({ _id: searchReqExists._id }, { $set: req.body }, { new: true })
            return apiRes.OK(res, message.APPRAISAL_UPDATED, searchReq);


        } catch (error) {
            switch (error.code) {
                case 11000:
                    return apiRes.DUPLICATE_VALUE(res, message.ERROR);

                default:
                    return apiRes.CATCH_ERROR(res, error.message);
            }
        }
    },

    deleteSearchReq: async (req, res) => {
        try {

            let { _id } = req.query

            const requestExists = await searchReqModel.findOne({ _id: _id })
            if (!requestExists) {
                return apiRes.BAD_REQUEST(res, message.SEARCH_REQUEST_NOT_FOUND);
            }

            await searchReqModel.findOneAndDelete({ _id: requestExists._id })
            return apiRes.OK(res, message.SEARCH_REQUEST_DELETED, {});


        } catch (error) {
            switch (error.code) {
                case 11000:
                    return apiRes.DUPLICATE_VALUE(res, message.ERROR);

                default:
                    return apiRes.CATCH_ERROR(res, error.message);
            }
        }
    }

};
