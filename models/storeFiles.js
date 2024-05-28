const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    link: {
        type: String,
    },
    filename: {
        type: String,
    }
})

const Files = mongoose.model("Files", fileSchema);

module.exports = Files;