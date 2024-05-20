const express = require("express");
const Register = require("../models/signup");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv').config();

const maxAge = 2 * 30 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({id}, process.env.SECRET, {
        expiresIn: maxAge
    });
}

module.exports.get_Registration = (req, res) => {
    res.render("registration.ejs");
}

module.exports.post_Registration = async (req, res) => {
    let {username, email, password} = req.body;
    try{
        let existingUser = await Register.findOne({username: username, email: email});
        if(existingUser){
            req.flash("error", "that user can already register please try to Login")
            console.log("user can alredy register");
            return res.redirect("/login");
        }
        let user = await Register.create({username, email, password});  
        const token = createToken(Register._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000});
        res.redirect("/login");
    }
    catch(err){
        console.log(err);
    }
}

module.exports.get_Login = (req, res) => {
    res.render("login.ejs");
}

module.exports.post_Login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await Register.findOne({ email: email });
        if (!user) {
            req.flash("error", "User not found. Please register first");
            return res.redirect('/registration'); 
        } 

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Invalid password.');
            req.flash("error", "Invalid fields");
            return res.redirect('/login'); 
        }

        const token = createToken(Register._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000});
        req.flash("error", "Login successful.");
        return res.redirect('/');
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).send('Internal server error');
    }
}

module.exports.logout = (req, res) => {
    res.cookie("jwt", "", {maxAge: 1});
    res.redirect("/")
}