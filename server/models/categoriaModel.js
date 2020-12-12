const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: String,
    icon: String,
    tipo: String,
    estado: {
        type: Boolean,
        default: true,
    },
}, { versionKey: false });

module.exports = mongoose.model("Categoria", categoriaSchema);