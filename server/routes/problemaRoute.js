const express = require("express");

let { verificaToken } = require("../middlewares/autenticacion");

const problemaCtrl = require("../controller/problemaController");

let app = express();

app.get("/problema", verificaToken, problemaCtrl.listar);
app.get("/problema/:id", verificaToken, problemaCtrl.mostrarPorId);
app.post("/problema", verificaToken, problemaCtrl.crear);
app.put("/problema/:id", verificaToken, problemaCtrl.actualizar);
app.delete("/problema/:id", verificaToken, problemaCtrl.eliminar);
app.get("/problema/buscar/:termino", verificaToken, problemaCtrl.buscar);
app.get("/problemacat/", verificaToken, problemaCtrl.catProblema);
app.get("/problemacat/listar", verificaToken, problemaCtrl.mostrarPorCat);

module.exports = app;