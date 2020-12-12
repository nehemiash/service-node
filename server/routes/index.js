const express = require("express");
const app = express();

app.use(require("./categoriaRoute"));
app.use(require("./centroRoute"));
app.use(require("./clienteRoute"));
app.use(require("./loginRoute"));
app.use(require("./notaRoute"));
app.use(require("./ordenRoute"));
app.use(require("./problemaRoute"));
app.use(require("./productoRoute"));
app.use(require("./repuestoRoute"));
app.use(require("./uploadsRoute"));
app.use(require("./usuarioRoute"));

module.exports = app;