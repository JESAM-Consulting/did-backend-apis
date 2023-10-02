const { hash, compare } = require("bcryptjs");
const jwt = require("jsonwebtoken");

const roleModel = require("../models/roles/roles.model");
const adminModel = require("../models/admin/admin.model");

const { USER_TYPE } = require("../json/enums.json");
const adminDebug = require("debug")("admin");

module.exports = {
  hashString: async (string) => await hash(string, 10),

  compareString: async (string, hash) => await compare(string, hash),

  validateEmptyFields: (payloadData, fields) => {
    let data4message = "please enter ";
    let array4fields = Object.keys(payloadData);
    let invalidFields = new Set();

    fields.forEach((field) => {
      if (!array4fields.includes(field)) {
        invalidFields.add(field);
      }
    });

    for (const key in payloadData) {
      if (fields.includes(key) && payloadData[key] === "") {
        invalidFields.add(key);
      }
    }
    if (invalidFields.size) {
      const array = Array.from(invalidFields);
      return data4message + array.join(", ");
    } else {
      return null;
    }
  },

  generateToken: (payload, expiry) => {
    if (expiry) {
      return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: expiry ? expiry : "",
      });
    } else {
      return jwt.sign(payload, process.env.JWT_SECRET);
    }
  },

  // createAdmin: async () => {
  //   try {
  //     let adminRoleExist = await roleModel.findOne({ roleName: USER_TYPE.ADMIN });
  //     let admin = await adminModel.findOne({ email: process.env.ADMIN_EMAIL });

  //     if (!adminRoleExist) {
  //       adminDebug("Admin role not exist, Please create role and restart the server");
  //       return;
  //     }
  //     if (!admin) {
  //       await new adminModel({
  //         email: process.env.ADMIN_EMAIL,
  //         password: process.env.ADMIN_PASSWORD,
  //         role: adminRoleExist._id,
  //         isVerified: true
  //       }).save();
  //       adminDebug("created successfully");
  //       return;
  //     }
  //     adminDebug("already exist");
  //     return;
  //   } catch (error) {
  //     console.log("createAdmin", error);
  //     adminDebug("creation error");
  //   }
  // },

  userNormalizer: async () => {
    try {
      await adminModel.updateMany({}, {
        isOnline: false,
        socketId: null
      })
    } catch (error) {
      console.log("userNormalizer", error);
    }
  }
};