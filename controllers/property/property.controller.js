const message = require("../../json/message.json");
const propertyModel = require("../../models/property/property.model");
const { validateEmptyFields } = require("../../utils/utils");
const apiRes = require("../../utils/apiResponse");
let moment = require('moment')
const ObjectId = require("mongoose").Types.ObjectId

module.exports = {
  createProperty: async (req, res) => {
    try {
      let admin = req.userData

      let response = [];
      if (req.files) {
        for (let i = 0; i < req.files.length; i++) {
          response.push(req.files[i].location);
        }
      }

      let data = {
        ...req.body,
        availableFrom: req.body.availableFrom ? new Date(req.body.availableFrom) : null,
        builtDate: req.body.builtDate ? new Date(req.body.builtDate) : null,
        propertyImage: response.length > 0 ? response : [],
        listedBy: admin._id
      }

      let property = await new propertyModel(data).save();
      return apiRes.OK(res, message.PROPERTY_CREATED, property);


    } catch (error) {
      console.log("🚀 ~ file: property.controller.js:31 ~ createProperty: ~ error", error)
      switch (error.code) {
        case 11000:
          return apiRes.DUPLICATE_VALUE(res, message.ERROR);

        default:
          return apiRes.CATCH_ERROR(res, error.message);
      }
    }
  },

  getProperty: async (req, res) => {
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
          { propertyName: { $regex: letter, $options: "i" } },
          { propertyNote: { $regex: letter, $options: "i" } },
          { propertyAddress: { $regex: letter, $options: "i" } },
          { sellingDue: { $regex: letter, $options: "i" } },
          { propertyType: { $regex: letter, $options: "i" } },
          { houseType: { $regex: letter, $options: "i" } },
          { usage: { $regex: letter, $options: "i" } },
          { state: { $regex: letter, $options: "i" } },
          { city: { $regex: letter, $options: "i" } },
        ]
      } : ""

      // if (letter) { criteria.propertyName = { $regex: letter, $options: 'i' } }

      const propertyCount = await propertyModel.find(req.query).countDocuments()
      const getProperty = await propertyModel.find(req.query)
        .sort({ createdAt: -1 })
        .skip(limit * page - limit)
        .limit(limit)

      if (getProperty.length) {
        return apiRes.OK(res, message.PROPERTY_FETCHED, { getProperty, count: propertyCount });
      } else {
        return apiRes.OK(res, message.PROPERTY_NOT_FOUND);
      }

    } catch (error) {
      console.log("🚀 ~ file: property.controller.js:68 ~ getProperty: ~ error", error)
      switch (error.code) {
        case 11000:
          return apiRes.DUPLICATE_VALUE(res, message.ERROR);

        default:
          return apiRes.CATCH_ERROR(res, error.message);
      }
    }
  },

  updateProperty: async (req, res) => {
    try {

      let { _id } = req.query

      const propertyExists = await propertyModel.findOne({ _id: _id })
      if (!propertyExists) {
        return apiRes.BAD_REQUEST(res, message.PROPERTY_NOT_FOUND);
      }

      let response = [];
      if (req.files) {
        for (let i = 0; i < req.files.length; i++) {
          response.push(req.files[i].location);
        }
      }

      let body = {
        ...req.body,
        availableFrom: req.body.availableFrom ? moment(String(req.body.availableFrom)) : propertyExists.availableFrom,
        builtDate: req.body.builtDate ? moment(String(req.body.builtDate)) : propertyExists.builtDate,
        propertyImage: response.length > 0 ? response : propertyExists.propertyImage,
      }

      let property = await propertyModel.findOneAndUpdate({ _id: propertyExists._id }, { $set: body }, { new: true })
      return apiRes.OK(res, message.PROPERTY_UPDATED, property);


    } catch (error) {
      console.log("🚀 ~ file: property.controller.js:106 ~ updateProperty: ~ error", error)
      switch (error.code) {
        case 11000:
          return apiRes.DUPLICATE_VALUE(res, message.ERROR);

        default:
          return apiRes.CATCH_ERROR(res, error.message);
      }
    }
  },

  deleteProperty: async (req, res) => {
    try {

      let { _id } = req.query

      const propertyExists = await propertyModel.findOne({ _id: _id })
      if (!propertyExists) {
        return apiRes.BAD_REQUEST(res, message.PROPERTY_NOT_FOUND);
      }

      await propertyModel.findOneAndUpdate({ _id: propertyExists._id }, { $set: { isActive: false } }, { new: true })
      return apiRes.OK(res, message.PROPERTY_DELETED, {});


    } catch (error) {
      console.log("🚀 ~ file: property.controller.js:132 ~ deleteProperty: ~ error", error)
      switch (error.code) {
        case 11000:
          return apiRes.DUPLICATE_VALUE(res, message.ERROR);

        default:
          return apiRes.CATCH_ERROR(res, error.message);
      }
    }
  },

  pushImage: async (req, res) => {
    try {

      let { _id } = req.query

      const propertyExists = await propertyModel.findOne({ _id: _id })
      if (!propertyExists) {
        return apiRes.BAD_REQUEST(res, message.PROPERTY_NOT_FOUND);
      }

      let response = [];
      if (req.files) {
        for (let i = 0; i < req.files.length; i++) {
          response.push(req.files[i].location);
        }
      }

      let body = {
        propertyImage: response.length > 0 ? response : [],
      }

      let property = await propertyModel.findOneAndUpdate({ _id: propertyExists._id }, { $push: body }, { new: true })
      return apiRes.OK(res, message.PROPERTY_UPDATED, property);


    } catch (error) {
      console.log("🚀 ~ file: property.controller.js:106 ~ pushImage: ~ error", error)
      switch (error.code) {
        case 11000:
          return apiRes.DUPLICATE_VALUE(res, message.ERROR);

        default:
          return apiRes.CATCH_ERROR(res, error.message);
      }
    }
  },

  removeImage: async (req, res) => {
    try {

      let { _id } = req.query

      const propertyExists = await propertyModel.findOne({ _id: _id })
      if (!propertyExists) {
        return apiRes.BAD_REQUEST(res, message.PROPERTY_NOT_FOUND);
      }

      propertyExists.propertyImage.map(async () => {
        await propertyModel.findOneAndUpdate({ _id: propertyExists._id }, { $pull: { propertyImage: { $eq: req.body.propertyImage } } }, { new: true })
      })
      return apiRes.OK(res, message.PROPERTY_UPDATED);

    } catch (error) {
      console.log("🚀 ~ file: property.controller.js:106 ~ removeImage: ~ error", error)
      switch (error.code) {
        case 11000:
          return apiRes.DUPLICATE_VALUE(res, message.ERROR);

        default:
          return apiRes.CATCH_ERROR(res, error.message);
      }
    }
  }

};
