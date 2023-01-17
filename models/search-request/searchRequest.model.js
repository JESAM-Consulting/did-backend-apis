const { hash } = require("bcryptjs");
const { Schema, model } = require("mongoose");
const { PRPPERTY_TYPE, HOUSE_TYPE, CURRENT_USAGE, SEARCH_REQUEST } = require("../../json/enums.json")

const searchSchema = new Schema(
  {
    searchRequest: { type: String },
    city: { type: String },
    state: { type: String },
    propertyRent: { type: String },
    propertyBuy: { type: String },
    maxRentPrice: { type: Number },
    areaSize: { type: Number },
    roomCount: { type: Number },
    maxBuyPrice: { type: Number },
    searchDate: { type: Date },
    other: { type: String },
    fullName: { type: String },
    email: { type: String },
    phone: { type: Number },
    api: {type: String, default: "search-request"},
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

let propertyModel = model("search-query", searchSchema, "search-query");
module.exports = propertyModel;
