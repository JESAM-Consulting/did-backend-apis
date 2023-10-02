const { hash } = require("bcryptjs");
const { Schema, model } = require("mongoose");
const { PRPPERTY_TYPE, HOUSE_TYPE, CURRENT_USAGE } = require("../../json/enums.json")

const appraisalSchema = new Schema(
  {
    appraisal: { type: String },
    houseType: { type: String },
    livingSize: { type: Number },
    areaSize: { type: Number },
    roomCount: { type: Number },
    isOwner: { type: String },
    usage: { type: String },
    builtDate: { type: Date },
    sellingDue: { type: String },
    location: { type: Number },
    fullName: { type: String },
    email: { type: String },
    phone: { type: Number },
    api: { type: String, default: "Appraisal" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

let apprisalModel = model("appraisal", appraisalSchema, "appraisal");
module.exports = apprisalModel;
