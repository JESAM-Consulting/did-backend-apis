const { hash } = require("bcryptjs");
const { Schema, model } = require("mongoose");
const message = require("../../json/message.json");

const contactSchema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    phone: { type: Number },
    occupationRole: { type: String },
    description: { type: String },
    knowUs: { type: String },
    news: { type: Boolean },
    tNc: { type: Boolean },
    support: [{ type: String }],
    Sonstiges: { type: String },
    type: { type: String, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

let contactModel = model("contact", contactSchema, "contact");
module.exports = contactModel;