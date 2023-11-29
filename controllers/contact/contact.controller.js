const message = require("../../json/message.json");
const contactModel = require("../../models/contact/contact.model");
const { validateEmptyFields } = require("../../utils/utils");
const apiRes = require("../../utils/apiResponse");
let moment = require('moment')
const ObjectId = require("mongoose").Types.ObjectId
const { sendDataEmail } = require("../../service/mail.service")

module.exports = {
  addContact: async (req, res) => {
    try {

      let validateMsg = validateEmptyFields(req.body, ["firstName", "lastName", "email", "phone"]);
      if (validateMsg) {
        return apiRes.BAD_REQUEST(res, validateMsg);
      }

      let contact = await contactModel.create(req.body)

      await sendDataEmail(req.body);
      return apiRes.OK(res, message.CONTACT_CREATED, contact);

    } catch (error) {
      console.log("🚀 ~ file: contact.controller.js:20 ~ addContact: ~ error", error)
      switch (error.code) {
        case 11000:
          return apiRes.DUPLICATE_VALUE(res, message.ERROR);

        default:
          return apiRes.CATCH_ERROR(res, error.message);
      }
    }
  },

  getContact: async (req, res) => {
    try {
      let { _id, letter, type } = req.query

      // pagination
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 10

      let criteria = {type: { $in: type ? type?.split('|') : [] }}
      if (_id) { criteria._id = ObjectId(_id) }

      if (letter) {
        criteria = {
          $or: [
            { firstName: { $regex: letter, $options: 'i' } },
            { lastName: { $regex: letter, $options: 'i' } },
            { occupationRole: { $regex: letter, $options: 'i' } },
            { email: { $regex: letter, $options: 'i' } },
            { knowUs: { $regex: letter, $options: 'i' } },
            { support: { $regex: letter, $options: 'i' } },
            { Sonstiges: { $regex: letter, $options: 'i' } },
          ],
          type: { $in: type ? type?.split('|') : [] }
        }
      }

      const propertyCount = await contactModel.find(criteria).countDocuments()
      const getContact = await contactModel.find(criteria)
        .sort({ createdAt: -1 })
        .skip(limit * page - limit)
        .limit(limit)

      if (getContact.length) {
        return apiRes.OK(res, message.CONTACT_FETCHED, { getContact, count: propertyCount });
      } else {
        return apiRes.OK(res, message.CONTACT_NOT_FOUND);
      }


    } catch (error) {
      console.log("🚀 ~ file: contact.controller.js:56 ~ getContact: ~ error", error)
      switch (error.code) {
        case 11000:
          return apiRes.DUPLICATE_VALUE(res, message.ERROR);

        default:
          return apiRes.CATCH_ERROR(res, error.message);
      }
    }
  },

  updateContact: async (req, res) => {
    try {

      let { _id } = req.query

      const contactExists = await contactModel.findOne({ _id: _id })
      if (!contactExists) {
        return apiRes.BAD_REQUEST(res, message.CONTACT_NOT_FOUND);
      }

      let property = await contactModel.findOneAndUpdate({ _id: propertyExists._id }, { $set: req.body }, { new: true })
      return apiRes.OK(res, message.CONTACT_UPDATED, property);


    } catch (error) {
      console.log("updateContact error", error.message);
      switch (error.code) {
        case 11000:
          return apiRes.DUPLICATE_VALUE(res, message.ERROR);

        default:
          return apiRes.CATCH_ERROR(res, error.message);
      }
    }
  },

  deleteContact: async (req, res) => {
    try {

      let { _id } = req.query

      const contactExists = await contactModel.findOne({ _id: _id })
      if (!contactExists) {
        return apiRes.BAD_REQUEST(res, message.CONTACT_NOT_FOUND);
      }

      await contactModel.findOneAndDelete({ _id: contactExists._id })
      return apiRes.OK(res, message.CONTACT_DELETED, {});

    } catch (error) {
      console.log("🚀 ~ file: contact.controller.js:107 ~ deleteContact: ~ error", error)
      switch (error.code) {
        case 11000:
          return apiRes.DUPLICATE_VALUE(res, message.ERROR);

        default:
          return apiRes.CATCH_ERROR(res, error.message);
      }
    }
  }
};
