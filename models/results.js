const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    subject1 : {
        type: String,
        required: true
    },
    marks1: {
        type: Number,
        required: true
    },
    subject2 : {
        type: String,
        required: true
    },
    marks2: {
        type: Number,
        required: true
    },
    subject3 : {
        type: String,
        required: true
    },
    marks3: {
        type: Number,
        required: true
    },
    subject4 : {
        type: String,
        required: true
    },
    marks4: {
        type: Number,
        required: true
    }
});

const Result = mongoose.model("Result", resultSchema);

module.exports = Result;