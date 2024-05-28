const express = require("express");
const Register = require("../models/signup");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const final = require("../generateOtp");
const nodemailer = require("nodemailer");
const Files = require("../models/storeFiles");
const Product = require("../models/product");

const maxAge = 2 * 30 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({id}, "veryTopSecret" , {
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
        const cookies = res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000});
        
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

module.exports.get_resetpassword = (req, res) => {
    res.render("resetPassword.ejs")
}

module.exports.post_reset = async(req, res) => {
    const { email, oldpassword, newpassword } = req.body;
    const user = await Register.findOne({email});
    if(!user){
        req.flash("error", "user not register");
        return res.redirect("/registration");
    }
    const isMatch = await bcrypt.compare(oldpassword, user.password);
    if(!isMatch){
        req.flash("error", "old password is incorrect");
        return res.redirect("/resetpassword");
    }
    const hashedNewPassword = await bcrypt.hash(newpassword, 10);
    const created = await Register.findOneAndUpdate({email: email, password: hashedNewPassword});
    
    req.flash("error", "password changed successfully");
    await created.save();

    res.redirect("/login"); 
}

module.exports.get_forgot = (req, res) => {
    res.render("forgot.ejs");
}

module.exports.post_forgot = async (req, res) => {
    let { email } = req.body;
    const user = await Register.findOne({ email });
    if (!user) {
        req.flash("error", "user not register");
        return res.redirect("/registration");
    }
    const otp = final;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'chiragjethva23@gmail.com',
            pass: 'sjhs sxte xaee jjbq'
        },
    });
    const main = async () => {
        const info = await transporter.sendMail({
            from: 'chiragjethva23@gmail.com',
            to: email,
            subject: "Verification OTP",
            text: `Verification OTP : ${otp}, Don't share another person keep it private`
        });
        console.log("Message sent: %s", info.messageId);
    }

    main().then(() => {
        console.log("OTP sent");
        res.render("otp.ejs");
    })
        .catch(error => {
            console.error(error);
            res.status(500).send("Failed to send OTP");
        });
}

module.exports.get_otp = (req, res) => {
    res.render("otp.ejs");
}

module.exports.post_otp = async (req, res) => {
    let { otp, newpassword, email } = req.body;
    const newOtp = final;
    
    if(newOtp != otp){
        req.flash("error", "Invalid OTP");
        return res.redirect("/otp-receive");
    }
    const hashedNewPassword = await bcrypt.hash(newpassword, 10);
    const created = await Register.findOneAndUpdate({ email: email, password: hashedNewPassword });
    req.flash("error", "password was change");
    res.redirect("/login");
}

module.exports.get_files = (req, res) => {
    res.render("file.ejs");
}

module.exports.post_files =async (req, res) => {
    const url = req.file.path;
    const fileName = req.file.filename;
    let final = new Files({link:url, filename:fileName});
    await final.save()
    res.redirect("/show-image");
}

module.exports.show_image = async (req, res) => {
    const findedImage = await Files.find({});
    res.render("showImage.ejs", {findedImage});
}

module.exports.delete_image = async (req, res) => {
    let{ id } = req.params;
    await Files.findByIdAndDelete(id);
    res.redirect("/show-image");
}


//for products
module.exports.get_ecommerce = async (req, res) => {
    let allProduct = await Product.find({});
    res.render("./listing/ecommerceIndex.ejs", { allProduct });
}
module.exports.create_product = (req, res) => {
    res.render("./listing/create-product.ejs"); 
}

module.exports.post_product = async (req, res) => {
    let { categories, productname, Description, price} = req.body;
    let image = req.file.path;

    let newProduct = new Product({categories: categories, productname: productname, Description: Description, price: price, link: image});
    req.flash("error", "new listing created");
    await newProduct.save();
    res.redirect("/get-eccomerce");
}

module.exports.getedit_product = async (req, res) => {
    let { id } = req.params;

    let findProduct = await Product.findById(id);
    res.render("./listing/edit-product.ejs", {findProduct});
}

module.exports.putedit = async (req, res) => {
    let { id } = req.params;
   let result = await Product.findByIdAndUpdate(id, {...req.body.edit});

   req.flash("error","listing was updated");
   res.redirect("/get-eccomerce")
}

module.exports.delete_product = async (req, res) => {
    let { id } = req.params;
    await Product.findByIdAndDelete(id);

    req.flash("error","listing deleted");
    res.redirect("/get-eccomerce"); 
}

module.exports.search = async (req, res) => {
    let { search } = req.body;
    
    let finded = await Product.find({categories: search});
    console.log(finded);

    if(finded.length == 0){
        req.flash("error", "Not available for this categories   ");
        return res.redirect("/get-eccomerce");
    }
    
    res.render("./listing/searching.ejs", { finded });
}