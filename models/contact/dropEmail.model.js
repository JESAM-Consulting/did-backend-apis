const { hash } = require("bcryptjs");
const { Schema, model } = require("mongoose");
const message = require("../../json/message.json");

const contactSchema = new Schema(
  {
    email: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

let contactModel = model("drop-email", contactSchema, "drop-email");
module.exports = contactModel;
