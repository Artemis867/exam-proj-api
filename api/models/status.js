const mongoose = require("mongoose");

const statusSchema = mongoose.Schema({
    statusId: Number,
    statusContent: String
});

module.exports = mongoose.model('Status', statusSchema);