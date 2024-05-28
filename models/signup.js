const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const signupUserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    }
});


signupUserSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) {
            return next();
        }
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

const Register = mongoose.model("Register", signupUserSchema);

module.exports = Register;