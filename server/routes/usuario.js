const express = require("express");

const bcrypt = require("bcrypt");

const _ = require("underscore");

const Usuario = require("../models/usuario");
const {
    verificaToken,
    verificaAdmin_Role,
} = require("../middlewares/autenticacion");

const app = express();

const jwt = require("jsonwebtoken");

app.get("/usuario", verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);

    Usuario.find({ estado: true },
            "nombre email role estado creado google img ultimoLogin tecnico telefono"
        )
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.json({
                    ok: false,
                    err,
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo,
                });
            });
        });
});

app.post("/usuario", function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        creado: Date.now(),
        telefono: body.telefono,
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.json({
                ok: false,
                err,
            });
        }

        let token = jwt.sign({
                usuario: usuarioDB,
            },
            process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }
        );

        // usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB,
            token,
        });
    });
});

app.put("/usuario/:id", [verificaToken], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, [
        "nombre",
        "email",
        "img",
        "role",
        "google",
        "estado",
        "tecnico",
        "telefono",
    ]);

    Usuario.findByIdAndUpdate(
        id,
        body, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
            context: "query", // esta opcion es para que reemplace un valor unique
        },
        (err, usuarioDB) => {
            if (err) {
                return res.json({
                    ok: false,
                    err: err.message,
                });
            }

            let token = jwt.sign({
                    usuario: usuarioDB,
                },
                process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }
            );

            // usuarioDB.password = null;

            res.json({
                ok: true,
                usuario: usuarioDB,
                token,
            });
        }
    );
});

app.delete("/usuario/:id", [verificaToken, verificaAdmin_Role], function(
    req,
    res
) {
    let id = req.params.id;

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    let cambiaEstado = {
        estado: false,
    };

    Usuario.findByIdAndUpdate(
        id,
        cambiaEstado, { new: true, useFindAndModify: false },
        (err, usuarioBorrado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            if (!usuarioBorrado) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Usuario No encontrado",
                    },
                });
            }

            res.json({
                ok: true,
                usuario: usuarioBorrado,
            });
        }
    );
});

// =======================================================
// Buscar un usuario por el nombre o el email
// =======================================================
app.get("/usuario/buscar/:termino", verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, "i");

    Usuario.find({
            $or: [{ nombre: regex }, { email: regex }],
        })
        .populate("categoria", "descripcion")
        .exec((err, usuario) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (Object.entries(usuario).length === 0) {
                return res.status(400).json({
                    ok: false,
                    message: "No se encontro el usuario",
                });
            }

            res.json({
                ok: true,
                usuario,
            });
        });
});

app.get("/usuario/update", verificaToken, (req, res) => {
    res.json({
        ok: true,
        usuario: req.usuario,
    });
});

module.exports = app;