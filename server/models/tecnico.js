const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let tecnicoSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
    },
    estado: {
        type: Boolean,
    },
    creado: {
        type: Date,
    },
}, { versionKey: false });

module.exports = mongoose.model("Tecnico", tecnicoSchema);