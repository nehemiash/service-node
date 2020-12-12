const express = require("express");

const loginCtrl = require("../controller/loginController");

const app = express();

app.post("/login", loginCtrl.login);

module.exports = app;