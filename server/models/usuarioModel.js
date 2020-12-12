const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

let rolesValidos = {
    values: ["ADMIN_ROLE", "USER_ROLE"],
    message: "{VALUE} no es un rol valido",
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: String,
    email: String,
    telefono: String,
    password: String,
    img: String,
    role: {
        type: String,
        default: "USER_ROLE",
        enum: rolesValidos,
    },
    creado: Date,
    ultimoLogin: Date,
    tecnico: Boolean,
    funcion: String,
    estado: {
        type: Boolean,
        default: true,
    },
}, { versionKey: false });

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
};

usuarioSchema.plugin(uniqueValidator, {
    message: "El email ya existe",
});

module.exports = mongoose.model("Usuario", usuarioSchema);