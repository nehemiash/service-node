const express = require("express");

const { verificaToken, verificaAdmin_Role } = require("../middlewares/autenticacion");

const usuarioCtrl = require("../controller/usuarioController");

const app = express();

app.get("/usuario", verificaToken, usuarioCtrl.listar);
app.post("/usuario", usuarioCtrl.crear);
app.put("/usuario/:id", verificaToken, usuarioCtrl.actualizar);
app.delete("/usuario/:id", [verificaToken, verificaAdmin_Role], usuarioCtrl.eliminar);
app.get("/usuario/buscar/:termino", verificaToken, usuarioCtrl.buscar);
app.get("/usuario/verificar", [verificaToken], usuarioCtrl.verificar);
app.get("/tecnico", verificaToken, usuarioCtrl.listarTecnicos);

module.exports = app;