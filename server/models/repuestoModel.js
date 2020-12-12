const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let repuestoSchema = new Schema({
    codigo: Number,
    descripcion: String,
    marca: String,
    numParte: String,
    categoria: {
        type: Schema.Types.ObjectId,
        ref: "Categoria",
    },
    precioCosto: Number,
    precioVenta: Number,
    cantidad: Number,
    stockMin: String,
    estado: {
        type: Boolean,
        default: true,
    },
}, { versionKey: false });

module.exports = mongoose.model("Repuesto", repuestoSchema);