const express = require("express");
const routes = express.Router();

//Middleware
const auth = require("../Middlewares/auth");
const upload = require("../Middlewares/upload");

//Validations
const testValidations = require("../Validations/testValidations");
const authValidations = require("../Validations/authValidations");

//Controllers
const testController = require("../Controllers/testController");
const authController = require("../Controllers/authController");

routes.get("/", (req, res) => {
  res.send("Api server running 5000");
});

routes.post("/test/upload", upload.single("file"), testController.upload);
routes.post("/test/create", auth, testController.create);
routes.post("/test/markAnswer", auth, testController.markAnswer);
routes.post("/test/result", auth, testController.getResult);
routes.post("/test/history", auth, testController.getHistory);

routes.post("/auth/login", authValidations.login, authController.login);
routes.post(
  "/auth/loginDirect",

  authController.login_direct
);
routes.post(
  "/auth/register",
  authValidations.register,
  authController.register
);

module.exports = routes;
