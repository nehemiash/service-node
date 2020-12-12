const express = require("express");

const { verificaToken } = require("../middlewares/autenticacion");

const productoCtrl = require("../controller/productoController");
let app = express();

app.get("/producto", verificaToken, productoCtrl.listar);
app.get("/producto/marcas", verificaToken, productoCtrl.marcas);
app.get("/producto/:id", verificaToken, productoCtrl.mostrarPorId);
app.get("/producto/buscar/:termino", verificaToken, productoCtrl.buscar);
app.post("/producto", verificaToken, productoCtrl.crear);
app.put("/producto/:id", verificaToken, productoCtrl.actualizar);
app.delete("/producto/:id", verificaToken, productoCtrl.eliminar);

module.exports = app;