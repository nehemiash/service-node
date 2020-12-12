const express = require("express");

const { verificaToken } = require("../middlewares/autenticacion");

const repuestoCtrl = require("../controller/repuestoController");
let app = express();

app.get("/repuesto", verificaToken, repuestoCtrl.listar);
app.get("/repuesto/marcas", verificaToken, repuestoCtrl.marcas);
app.get("/repuesto/:id", verificaToken, repuestoCtrl.mostrarPorId);
app.get("/repuesto/buscar/:termino", verificaToken, repuestoCtrl.buscar);
app.post("/repuesto", verificaToken, repuestoCtrl.crear);
app.put("/repuesto/:id", verificaToken, repuestoCtrl.actualizar);
app.delete("/repuesto/:id", verificaToken, repuestoCtrl.eliminar);

module.exports = app;