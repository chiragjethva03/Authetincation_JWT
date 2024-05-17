const mongoose = require("mongoose");

const signupUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    }
});


const Register = mongoose.model("Register", signupUserSchema);

module.exports = Register;