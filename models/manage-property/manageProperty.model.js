const { hash } = require("bcryptjs");
const { Schema, model } = require("mongoose");
const { PRPPERTY_TYPE, HOUSE_TYPE, CURRENT_USAGE } = require("../../json/enums.json")

const managePropertySchema = new Schema(
  {
    manageType: [{ type: String }],
    areaSize: { type: Number },
    propertySize: { type: Number },
    currentUsage: { type: String },
    location: { type: Number },
    fullName: { type: String },
    email: { type: String },
    phone: { type: Number },
    api: { type: String, default: "manage-property" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

let propertyModel = model("manage-property", managePropertySchema, "manage-property");
module.exports = propertyModel;
