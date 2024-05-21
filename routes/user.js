const express = require("express");
const routes = express.Router();
const userController = require("../controllers/user");

routes.get("/registration", userController.get_Registration);

routes.post("/registration", userController.post_Registration)

routes.get("/login", userController.get_Login);

routes.post('/login', userController.post_Login);

routes.get("/logout", userController.logout);

module.exports = routes;