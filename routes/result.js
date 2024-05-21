const express = require("express");
const Result = require("../models/results.js")
const routes = express.Router();
const resultController = require("../controllers/result.js");
const { requireAuthentication } = require("../middleware.js");

routes.get("/create", resultController.create);

routes.post("/create", resultController.post_create);

routes.get("/read",requireAuthentication, resultController.readResult);

routes.get("/:id/edit", resultController.editResult);

routes.put("/:id/update", resultController.put_update);

routes.delete("/:id/delete", resultController.delete)

module.exports = routes;