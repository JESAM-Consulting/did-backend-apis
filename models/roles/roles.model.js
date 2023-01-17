const { Schema, model } = require("mongoose");

const { ROLE } = require('../../json/enums.json');

let roleSchema = new Schema({
    roleName: {
        type: String,
        enum: { values: [...Object.values(ROLE)], message: "Invalid role" },
        unique: true,
        message: "please enter valid role name or role already exist"
    },
    description: {
        type: String
    }
}, {
    timestamps: true,
    versionKey: false
})


let roleModel = model("roles", roleSchema, "roles");

module.exports = roleModel;