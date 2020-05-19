const express = require("express");
const app = express();

app.use(require("./usuario"));
app.use(require("./login"));
app.use(require("./categoria"));
app.use(require("./producto"));
app.use(require("./uploads"));
app.use(require("./imagenes"));
app.use(require("./cliente"));
app.use(require("./nota"));
app.use(require("./parteapple"));
app.use(require("./consolidacion"));
app.use(require("./stock"));
app.use(require("./kbb"));

module.exports = app;