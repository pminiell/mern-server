const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users-controller");
const HttpError = require("../models/http-error");
const router = express.Router();

router.get("/", usersController.getUsers);

router.get("/:uid", usersController.getUsersById);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersController.signup
);

router.post("/login", usersController.login);

module.exports = router;
