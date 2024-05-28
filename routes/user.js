const express = require("express");
const routes = express.Router();
const userController = require("../controllers/user");
const Register = require("../models/signup"); 
const bcrypt = require("bcrypt");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
      return res.redirect('/registration');
    }
    jwt.verify(token, 'veryTopSecret', (err, decoded) => {
      if (err) {
        return res.redirect('/login');
      }
      req.user = decoded; // Attach the decoded token data to the request object
      next();
    });
};

routes.get("/registration", userController.get_Registration);

routes.post("/registration", userController.post_Registration)

routes.get("/login", userController.get_Login);

routes.post('/login', userController.post_Login);

routes.get("/logout", userController.logout);

routes.get("/resetpassword", userController.get_resetpassword);

routes.post("/reset", userController.post_reset);

routes.get("/forgotpassword", userController.get_forgot)

routes.post("/forgot", userController.post_forgot);

routes.get("/otp-receive", userController.get_otp);

routes.post("/otp-receive", userController.post_otp);

routes.get("/file", userController.get_files);

routes.post("/files",upload.single('image'), userController.post_files);

routes.get("/show-image", userController.show_image);

routes.post("/image-delete/:id", userController.delete_image);


//
routes.get("/get-eccomerce", verifyToken, userController.get_ecommerce);

routes.get("/create-product", userController.create_product);

routes.post("/post-product", upload.single('image'), userController.post_product); 

routes.get("/:id/edit-product", userController.getedit_product)

routes.put("/:id/edit-product", upload.single('image'), userController.putedit);

routes.delete("/:id/delete-product", userController.delete_product);

routes.post("/search", userController.search);

module.exports = routes;