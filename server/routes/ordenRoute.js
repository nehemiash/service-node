const express = require("express");

let { verificaToken } = require("../middlewares/autenticacion");

let app = express();

const ordenCtrl = require("../controller/ordenController");

app.get("/orden", verificaToken, ordenCtrl.listar);
app.get("/orden/:id", verificaToken, ordenCtrl.mostrarPorID);
app.post("/orden", verificaToken, ordenCtrl.crear);
app.put("/orden/:id", verificaToken, ordenCtrl.actualizar);
app.put("/orden/aprobar/:id", verificaToken, ordenCtrl.aprobar);
app.put("/orden/ubicar/:id", verificaToken, ordenCtrl.ubicar);
app.put("/orden/entregar/:id", verificaToken, ordenCtrl.entregar);
app.get("/orden/buscar/:termino", verificaToken, ordenCtrl.buscar);

module.exports = app;