const { hash } = require("bcryptjs");
const { Schema, model } = require("mongoose");
const { PRPPERTY_TYPE, HOUSE_TYPE, CURRENT_USAGE } = require("../../json/enums.json")

const propertySchema = new Schema(
  {
    propertyName: { type: String },
    propertyImage: [{ type: String }],
    city: { type: String },
    state: { type: String },
    propertyAddress: { type: String },
    propertyInterval: { type: Number },
    propertyNote: { type: String },
    postCode: { type: String },
    contactNo: { type: Number },
    availableFrom: { type: Date },
    builtDate: { type: Date },
    price: { type: Number },
    livingSpaceSize: { type: Number },
    areaSize: { type: Number },
    roomCount: { type: Number },
    description: { type: String },
    isBalcony: { type: Boolean },
    isBasement: { type: Boolean },
    isGueElevator: { type: Boolean },
    isGueToilet: { type: Boolean },
    isFurniture: { type: Boolean },
    parkView: { type: Boolean },
    isOwner: { type: String },
    sellingDue: { type: String },
    propertyType: { type: String },
    houseType: { type: String },
    usage: { type: String },
    basementCount: { type: Number },
    listedBy: {
      type: Schema.Types.ObjectId,
      ref: "role"
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

let propertyModel = model("property-master", propertySchema, "property-master");
module.exports = propertyModel;
