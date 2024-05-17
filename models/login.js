const mongoose = require("mongoose");

const loginUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    }
})



const Login = mongoose.model("SignUp", loginUserSchema);

module.exports = Login;