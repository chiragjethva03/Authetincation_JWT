const express = require("express");
const Result = require("../models/results.js")
const routes = express.Router();
const resultController = require("../controllers/result.js");   
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

routes.get("/create", resultController.create);

routes.post("/create", resultController.post_create);

routes.get("/read",verifyToken, resultController.readResult);

routes.get("/:id/edit", resultController.editResult);

routes.put("/:id/update", resultController.put_update);

routes.delete("/:id/delete", resultController.delete)

module.exports = routes;