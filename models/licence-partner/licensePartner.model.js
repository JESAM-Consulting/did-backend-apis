const { hash } = require("bcryptjs");
const { Schema, model } = require("mongoose");
const { PRPPERTY_TYPE, HOUSE_TYPE, CURRENT_USAGE } = require("../../json/enums.json")

const licensePartnerSchema = new Schema(
  {
    licensePartner: { type: String },
    areaSize: { type: Number },
    propertySize: { type: Number },
    usage: { type: String },
    location: { type: Number },
    fullName: { type: String },
    email: { type: String },
    phone: { type: Number },
    api: { type: String, default: "license-partner" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

let licensePartnerModel = model("license-partner", licensePartnerSchema, "license-partner");
module.exports = licensePartnerModel;
