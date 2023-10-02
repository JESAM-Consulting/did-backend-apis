const message = require("../../json/message.json");
const companyModel = require("../../models/company/company.model");
const { validateEmptyFields } = require("../../utils/utils");
const apiRes = require("../../utils/apiResponse");
let moment = require('moment')
const ObjectId = require("mongoose").Types.ObjectId

module.exports = {
  createCompany: async (req, res) => {
    try {
      let admin = req.userData

      let validateMsg = validateEmptyFields(req.body, ["name", "email", "phone"]);
      if (validateMsg) {
        return apiRes.BAD_REQUEST(res, validateMsg);
      }

      let response = [];
      if (req.files) {
        for (let i = 0; i < req.files.length; i++) {
          response.push(req.files[i].location);
        }
      }

      let data = {
        ...req.body,
        userImage: response.length > 0 ? response : [],
        listedBy: admin._id
      }

      let company = await new companyModel(data).save();
      return apiRes.OK(res, message.COMPANY_CREATED, company);


    } catch (error) {
      console.log("🚀 ~ file: company.controller.js:31 ~ createCompany: ~ error", error)
      switch (error.code) {
        case 11000:
          return apiRes.DUPLICATE_VALUE(res, message.ERROR);

        default:
          return apiRes.CATCH_ERROR(res, error.message);
      }
    }
  },

  getCompany: async (req, res) => {
    try {
      let { letter } = req.query

      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 10

      // pagination
      req.query = req.query.isAll === "true" ? { ...req.query } : { isActive: true, ...req.query }
      req.query.page = parseInt(req.query.page) || 1
      req.query.limit = parseInt(req.query.limit) || 100
      req.query.sortBy = req.query.sortBy || "createdAt"
      req.query.sortOrder = req.query.sortOrder || "desc"
      req.query.letter = req.query.letter ? req.query = {
        $or: [
          { name: { $regex: letter, $options: "i" } },
          { email: { $regex: letter, $options: "i" } },
          { occupationRole: { $regex: letter, $options: "i" } },
        ]
      } : ""
      // if (letter) { criteria.companyName = { $regex: letter, $options: 'i' } }

      const companyCount = await companyModel.find(req.query).countDocuments()
      const getCompany = await companyModel.find(req.query)
        .sort({ createdAt: -1 })
        .skip(limit * page - limit)
        .limit(limit)

      if (getCompany.length) {
        return apiRes.OK(res, message.COMPANY_FETCHED, { getCompany, count: companyCount });
      } else {
        return apiRes.OK(res, message.COMPANY_NOT_FOUND);
      }

    } catch (error) {
      console.log("🚀 ~ file: company.controller.js:68 ~ getCompany: ~ error", error)
      switch (error.code) {
        case 11000:
          return apiRes.DUPLICATE_VALUE(res, message.ERROR);

        default:
          return apiRes.CATCH_ERROR(res, error.message);
      }
    }
  },

  updateCompany: async (req, res) => {
    try {

      let { _id } = req.query

      const companyExists = await companyModel.findOne({ _id: _id })
      if (!companyExists) {
        return apiRes.BAD_REQUEST(res, message.COMPANY_NOT_FOUND);
      }

      let response = [];
      if (req.files) {
        for (let i = 0; i < req.files.length; i++) {
          response.push(req.files[i].location);
        }
      }

      let body = {
        ...req.body,
        userImage: response.length > 0 ? response : companyExists.userImage,
      }

      let company = await companyModel.findOneAndUpdate({ _id: companyExists._id }, { $set: body }, { new: true })
      return apiRes.OK(res, message.COMPANY_UPDATED, company);


    } catch (error) {
      console.log("🚀 ~ file: company.controller.js:106 ~ updateCompany: ~ error", error)
      switch (error.code) {
        case 11000:
          return apiRes.DUPLICATE_VALUE(res, message.ERROR);

        default:
          return apiRes.CATCH_ERROR(res, error.message);
      }
    }
  },

  deleteCompamy: async (req, res) => {
    try {

      let { _id } = req.query

      const companyExists = await companyModel.findOne({ _id: _id })
      if (!companyExists) {
        return apiRes.BAD_REQUEST(res, message.COMPANY_NOT_FOUND);
      }

      await companyModel.findOneAndDelete({ _id: companyExists._id })
      return apiRes.OK(res, message.COMPANY_DELETED, {});


    } catch (error) {
      console.log("🚀 ~ file: company.controller.js:132 ~ deleteCompamy: ~ error", error)
      switch (error.code) {
        case 11000:
          return apiRes.DUPLICATE_VALUE(res, message.ERROR);

        default:
          return apiRes.CATCH_ERROR(res, error.message);
      }
    }
  },

};
