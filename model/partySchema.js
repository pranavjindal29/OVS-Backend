const mongoose = require("mongoose");

const partySchema = new mongoose.Schema({
    "name": {type: String},
    "votes": {type: Number}
}, {
    collection: "parties"
});

module.exports = mongoose.model("partySchema", partySchema);