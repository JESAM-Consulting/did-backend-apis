const { hash } = require("bcryptjs");
const { Schema, model } = require("mongoose");
const { PRPPERTY_TYPE, HOUSE_TYPE, CURRENT_USAGE } = require("../../json/enums.json")

const companySchema = new Schema(
  {
    name: { type: String, },
    email: { type: String },
    phone: { type: String, },
    userImage: [{ type: String, }],
    occupationRole: { type: String, },
    description: { type: String, },
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

let companyModel = model("company", companySchema, "company");
module.exports = companyModel;
