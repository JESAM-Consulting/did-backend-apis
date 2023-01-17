const mongoose = require('mongoose');
const { userNormalizer } = require('../utils/utils');
const debugDb = require('debug')('db')

mongoose.connect(process.env.MONGO_URI).then(() => {
    debugDb("🏡 Property-connected")
}).catch(err => {
    debugDb(err);
})