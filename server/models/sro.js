const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let sroSchema = new Schema({
    numero: {
        type: String,
        required: [true, "El numero de SRO es necesario"],
        unique: true,
    },
    numeroGSX: {
        type: String,
        required: false,
    },
    creado: {
        type: Date,
        required: false,
    },
    cerrado: {
        type: Date,
        required: false,
    },
    activo: {
        type: Boolean,
        required: false,
    },
    kbb: [{
        type: Schema.Types.ObjectId,
        ref: "Kbb",
    }, ],
    nota: [{
        type: Schema.Types.ObjectId,
        ref: "Nota",
    }, ],
    modificado: {
        type: Date,
        required: false,
    },
}, { versionKey: false });

sroSchema.plugin(uniqueValidator, {
    message: "{El numero SRO debe de ser unico}",
});

module.exports = mongoose.model("Sro", sroSchema);