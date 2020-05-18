const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let notasSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, "La descripcion es necesaria"],
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
    },
    estado: {
        type: Boolean,
        default: true,
    },
    creada: {
        type: Date,
    },
    origen: {
        type: String,
        required: false,
    },
    sro: {
        type: Schema.Types.ObjectId,
        ref: "Sro",
    },
    os: {
        type: Schema.Types.ObjectId,
        ref: "Orden",
    },
}, { versionKey: false });

module.exports = mongoose.model("Nota", notasSchema);