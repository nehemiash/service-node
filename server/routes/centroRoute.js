const express = require("express");

let { verificaToken } = require("../middlewares/autenticacion");

const centroCtrl = require("../controller/centroController");
let app = express();

app.get("/centro", verificaToken, centroCtrl.listar);
app.post("/centro", verificaToken, centroCtrl.crear);
app.put("/centro/:id", verificaToken, centroCtrl.actualizar);

module.exports = app;