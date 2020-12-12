const express = require("express");

let { verificaToken } = require("../middlewares/autenticacion");

let app = express();

const categoriaCtrl = require("../controller/categoriaController");

app.get("/categoria", verificaToken, categoriaCtrl.listar);
app.get("/categoria/:id", verificaToken, categoriaCtrl.mostrarPorId);
app.post("/categoria", verificaToken, categoriaCtrl.agregar);
app.put("/categoria/:id", verificaToken, categoriaCtrl.actualizar);
app.delete("/categoria/:id", [verificaToken], categoriaCtrl.eliminar);
app.get("/categoria/sort/:sort", [verificaToken], categoriaCtrl.listarSort);
app.get("/categoria/buscar/:termino", verificaToken, categoriaCtrl.buscar);

module.exports = app;