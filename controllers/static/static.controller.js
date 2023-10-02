const message = require("../../json/message.json");
const staticModel = require("../../models/static/static.model");
const apiRes = require("../../utils/apiResponse");
const ObjectId = require("mongoose").Types.ObjectId

module.exports = {
    createStatic: async (req, res) => {
        try {
            let response = [];
            if (req.files) {
                for (let i = 0; i < req.files.length; i++) {
                    response.push(req.files[i].location);
                }
            }

            let data = {
                ...req.body,
                image: response.length > 0 ? response : [],
            }

            let searchReq = await new staticModel(data).save()
            return apiRes.OK(res, message.DATA_CREATED, searchReq);

        } catch (error) {
            switch (error.code) {
                case 11000:
                    return apiRes.DUPLICATE_VALUE(res, message.ERROR);

                default:
                    return apiRes.CATCH_ERROR(res, error.message);
            }
        }
    },

    getStatic: async (req, res) => {
        try {
            let { _id, letter } = req.query

            // pagination

            const page = parseInt(req.query.page) || 1
            const limit = parseInt(req.query.limit) || 10

            let criteria = {}
            if (_id) criteria._id = ObjectId(_id)
            if (letter) {
                criteria = {
                    $or: [
                        { name: { $regex: letter, $options: 'i' } },
                        { title: { $regex: letter, $options: 'i' } },
                        { subTitle: { $regex: letter, $options: 'i' } }
                    ]
                }
            }

            const searchCount = await staticModel.find(criteria).countDocuments()
            const getStatic = await staticModel.find(criteria)
                .sort({ createdAt: -1 })
                .skip(limit * page - limit)
                .limit(limit)

            if (getStatic.length) {
                return apiRes.OK(res, message.DATA_FETCHED, { getStatic, count: searchCount });
            } else {
                return apiRes.OK(res, message.DATA_NOT_FOUND);
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

    getStaticAll: async (req, res) => {
        try {
            let { _id, name } = req.query

            let criteria = {}
            if (_id) criteria._id = ObjectId(_id)
            if (name) criteria.name = name

            const searchCount = await staticModel.find(criteria).countDocuments()
            const getStatic = await staticModel.find(criteria)

            if (getStatic.length) {
                return apiRes.OK(res, message.DATA_FETCHED, { getStatic, count: searchCount });
            } else {
                return apiRes.OK(res, message.DATA_NOT_FOUND);
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

    updateStatic: async (req, res) => {
        try {

            let { _id } = req.query

            const requestExists = await staticModel.findOne({ _id: _id })
            if (!requestExists) {
                return apiRes.BAD_REQUEST(res, message.DATA_NOT_FOUND);
            }

            let response = [];
            if (req.files) {
                for (let i = 0; i < req.files.length; i++) {
                    response.push(req.files[i].location);
                }
            }
            console.log("body:::", req.body.name)

            let data = {
                ...req.body,
                image: response.length > 0 ? response : requestExists.image,
            }

            let static = await staticModel.findOneAndUpdate({ _id: requestExists._id }, { $set: data }, { new: true })
            return apiRes.OK(res, message.DATA_UPDATED, static);

        } catch (error) {
            switch (error.code) {
                case 11000:
                    return apiRes.DUPLICATE_VALUE(res, message.ERROR);

                default:
                    return apiRes.CATCH_ERROR(res, error.message);
            }
        }
    },

    deletestatic: async (req, res) => {
        try {

            let { _id } = req.query

            const requestExists = await staticModel.findOne({ _id: _id })
            if (!requestExists) {
                return apiRes.BAD_REQUEST(res, message.DATA_NOT_FOUND);
            }

            await staticModel.findOneAndDelete({ _id: requestExists._id })
            return apiRes.OK(res, message.DATA_DELETED, {});


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
