const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Usuario = require("../models/usuarioModel");

let login = (req, res) => {
    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.json({
                ok: false,
                err,
            });
        }

        if (!usuarioDB) {
            return res.json({
                ok: false,
                err: {
                    message: "(Usuario) o Contraseña incorrectos",
                },
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.json({
                ok: false,
                err: {
                    message: "Usuario o (Contraseña) incorrectos",
                },
            });
        }

        let token = jwt.sign({
                usuario: usuarioDB,
            },
            process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }
        );

        let cambiaFecha = {
            ultimoLogin: Date.now(),
        };

        Usuario.findByIdAndUpdate(
            usuarioDB.id,
            cambiaFecha, { new: true, useFindAndModify: false },
            (err, usuarioLogeado) => {
                if (err) {
                    return res.json({
                        ok: false,
                        err,
                    });
                }
            }
        );

        res.json({
            ok: true,
            usuario: usuarioDB,
            token,
        });

        // let fecha = usuarioDB.ultimoLogin ;
        // fecha.toString();
        // fecha.toUTCString();
        // console.log(`La fecha es ${fecha}`);
    });
};

module.exports = {
    login,
};