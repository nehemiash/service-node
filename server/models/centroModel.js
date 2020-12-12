const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let centroSchema = new Schema({
    nombre: String,
    direccion: String,
    telefono: String,
    mail: String,
    site: String,
    img: String,
}, { versionKey: false });

module.exports = mongoose.model("Centro", centroSchema);