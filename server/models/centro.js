const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let centroSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es necesario"],
    },
    direccion: {
        type: String,
        required: false,
    },
    telefono: {
        type: String,
        required: false,
    },
    mail: {
        type: String,
        required: false,
    },
    website: {
        type: String,
        required: false,
    },
    img: {
        type: String,
        required: false,
    },
    activo: {
        type: Boolean,
        required: false,
    },
}, { versionKey: false });

module.exports = mongoose.model("Centro", centroSchema);