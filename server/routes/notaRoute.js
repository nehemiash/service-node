const express = require("express");

let { verificaToken } = require("../middlewares/autenticacion");

const notaCtrl = require("../controller/notaController");

let app = express();

app.get("/nota", verificaToken, notaCtrl.listar);
app.get("/nota/:id", verificaToken, notaCtrl.mostrarPorId);
app.post("/nota", verificaToken, notaCtrl.crear);
app.put("/nota/:id", verificaToken, notaCtrl.actualizar);
app.delete("/nota/:id", verificaToken, notaCtrl.eliminar);
app.get("/nota/buscar/:termino", verificaToken, notaCtrl.buscar);

module.exports = app;