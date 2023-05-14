const mongoose = require("mongoose");

const checkResultSchema = new mongoose.Schema({
    url: String,
    status: Number,
    responseTime: Number,
    checkedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('CheckResult', checkResultSchema);