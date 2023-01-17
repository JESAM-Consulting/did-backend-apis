const { hash } = require("bcryptjs");
const { Schema, model } = require("mongoose");
const { PRPPERTY_TYPE, HOUSE_TYPE, CURRENT_USAGE, SEARCH_REQUEST } = require("../../json/enums.json")

const searchSchema = new Schema(
  {
    name: { type: String },
    title: { type: String },
    subTitle: { type: String },
    description: { type: String },
    image: [{ type: String }],
    services: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

let propertyModel = model("static", searchSchema, "static");
module.exports = propertyModel;
