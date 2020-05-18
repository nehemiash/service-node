const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let clienteSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El Nombre es necesario"],
    },
    documento: {
        type: String,
        required: [true, "El documento es necesario"],
        unique: true,
    },
    ruc: {
        type: String,
        required: false,
    },
    telefono: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: [true, "El correo es necesario"],
    },
    direccion: {
        type: String,
        required: false,
    },
    ciudad: {
        type: String,
        required: false,
    },
    pais: {
        type: String,
        required: false,
    },
    creado: {
        type: Date,
    },
    estado: {
        type: Boolean,
        default: true,
    },
}, { versionKey: false });

clienteSchema.plugin(uniqueValidator, {
    message: "{Documento debe de ser unico}",
});

module.exports = mongoose.model("Cliente", clienteSchema);