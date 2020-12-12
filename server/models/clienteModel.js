const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let clienteSchema = new Schema({
    codigo: Number,
    nombre: String,
    empresa: Boolean,
    contacto: String,
    documento: {
        type: String,
        required: [true, "El documento es necesario"],
        unique: true,
    },
    ruc: String,
    telefono: String,
    celular: String,
    email: String,
    direccion: String,
    ciudad: String,
    pais: String,
    creado: Date,
    estado: {
        type: Boolean,
        default: true,
    },
}, { versionKey: false });

clienteSchema.plugin(uniqueValidator, {
    message: "{Ya existe otro cliente con este documento}",
});

module.exports = mongoose.model("Cliente", clienteSchema);