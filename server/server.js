require("./config/config");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const bodyParser = require("body-parser");
const path = require("path");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//configurar cors
app.use(cors({ origin: true, credentials: true }));

//Configuracion Global de Rutas
app.use(require("./routes/index"));

mongoose.connect(
    process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) => {
        if (err) throw err;

        console.log("BD online");
    }
);

//Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, "../public")));

app.listen(process.env.PORT, () => {
    console.log("Escuchando en el puerto:", 3000);
});