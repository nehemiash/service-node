const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let notasSchema = new Schema({
    descripcion: String,
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
    },
    tipo: String,
    creada: Date,
    orden: {
        type: Schema.Types.ObjectId,
        ref: "Orden",
    },
    estado: {
        type: Boolean,
        default: true,
    },
}, { versionKey: false });

module.exports = mongoose.model("Nota", notasSchema);