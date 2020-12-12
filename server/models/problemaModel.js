const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let problemaSchema = new Schema({
    descripcion: String,
    categoria: String,
    estado: {
        type: Boolean,
        default: true,
    },
}, { versionKey: false });

module.exports = mongoose.model("Problema", problemaSchema);