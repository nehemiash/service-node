const express = require("express");

const { verificaToken } = require("../middlewares/autenticacion");

const clienteCtrl = require("../controller/clienteController");

const app = express();

app.get("/cliente", verificaToken, clienteCtrl.listar);
app.post("/cliente", verificaToken, clienteCtrl.crear);
app.put("/cliente/:id", verificaToken, clienteCtrl.actualizar);
app.delete("/cliente/:id", verificaToken, clienteCtrl.eliminar);
app.get("/cliente/buscar/:termino", verificaToken, clienteCtrl.buscar);
app.get("/cliente/mostrar/:id", verificaToken, clienteCtrl.mostrarPorId);
app.get("/cliente/mostrardoc/:doc", verificaToken, clienteCtrl.mostrarPorDoc);
module.exports = app;