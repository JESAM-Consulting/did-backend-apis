const message = require("../../json/message.json");
const emailModel = require("../../models/contact/dropEmail.model");
const { validateEmptyFields } = require("../../utils/utils");
const apiRes = require("../../utils/apiResponse");
const ObjectId = require("mongoose").Types.ObjectId

module.exports = {
  addEmail: async (req, res) => {
    try {

      let validateMsg = validateEmptyFields(req.body, ["email"]);
      if (validateMsg) {
        return apiRes.BAD_REQUEST(res, validateMsg);
      }

      let contact = await emailModel.create(req.body)
      return apiRes.OK(res, message.EMAIL_SENT, contact);

    } catch (error) {
      console.log("🚀 ~ file: contact.controller.js:20 ~ addEmail: ~ error", error)
      switch (error.code) {
        case 11000:
          return apiRes.DUPLICATE_VALUE(res, message.ERROR);

        default:
          return apiRes.CATCH_ERROR(res, error.message);
      }
    }
  },

  getEmail: async (req, res) => {
    try {
      let { _id, letter } = req.query

      // pagination
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 10

      let criteria = {}
      if (_id) { criteria._id = ObjectId(_id) }

      if (letter) criteria.email = { $regex: letter, $options: 'i' }

      const emailcount = await emailModel.find(criteria).countDocuments()
      const getEmail = await emailModel.find(criteria)
        .sort({ createdAt: -1 })
        .skip(limit * page - limit)
        .limit(limit)

      if (getEmail.length) {
        return apiRes.OK(res, message.USER_EMAIL_FETCHED, { getEmail, count: emailcount });
      } else {
        return apiRes.OK(res, message.EMAIL_NOT_FOUND);
      }


    } catch (error) {
      console.log("🚀 ~ file: contact.controller.js:56 ~ getEmail: ~ error", error)
      switch (error.code) {
        case 11000:
          return apiRes.DUPLICATE_VALUE(res, message.ERROR);

        default:
          return apiRes.CATCH_ERROR(res, error.message);
      }
    }
  },

  // updateEmail: async (req, res) => {
  //   try {

  //     let { id } = req.query

  //     const contactExists = await emailModel.findOne({ _id: id })
  //     if (!contactExists) {
  //       return apiRes.BAD_REQUEST(res, message.CONTACT_NOT_FOUND);
  //     }

  //     let property = await emailModel.findOneAndUpdate({ _id: contactExists._id }, { $set: req.body }, { new: true })
  //     return apiRes.OK(res, message.CONTACT_UPDATED, property);


  //   } catch (error) {
  //     console.log("updateEmail error", error.message);
  //     switch (error.code) {
  //       case 11000:
  //         return apiRes.DUPLICATE_VALUE(res, message.ERROR);

  //       default:
  //         return apiRes.CATCH_ERROR(res, error.message);
  //     }
  //   }
  // },

  deleteEmail: async (req, res) => {
    try {

      let { _id } = req.query

      const contactExists = await emailModel.findOne({ _id: _id })
      if (!contactExists) {
        return apiRes.BAD_REQUEST(res, message.EMAIL_NOT_FOUND);
      }

      await emailModel.findOneAndDelete({ _id: contactExists._id })
      return apiRes.OK(res, message.USER_EMAIL_DELETED, {});

    } catch (error) {
      console.log("🚀 ~ file: contact.controller.js:107 ~ deleteEmail: ~ error", error)
      switch (error.code) {
        case 11000:
          return apiRes.DUPLICATE_VALUE(res, message.ERROR);

        default:
          return apiRes.CATCH_ERROR(res, error.message);
      }
    }
  }

};
