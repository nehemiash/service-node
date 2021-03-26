const bcrypt = require("bcrypt");

const _ = require("underscore");

const Usuario = require("../models/usuarioModel");

const jwt = require("jsonwebtoken");

const { QueryOpts } = require("../controller/dbconfig");

let listar = (req, res) => {
    let pagina = Number(req.query.pagina) || 1;
    let limite = Number(req.query.limite) || 15;

    let skip = pagina - 1;
    skip = skip * limite;
    let total_paginas;
    let total_usuarios;

    Usuario.countDocuments({ estado: true }, (err, numOfDocs) => {
        if (err) throw err;
        total_paginas = Math.ceil(numOfDocs / limite);
        total_usuarios = numOfDocs;
    });

    Usuario.find({ estado: true }, "nombre email estado creado ultimoLogin funcion tecnico telefono")
        .skip(skip)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.json({
                    ok: false,
                    err,
                });
            }

            res.json({
                ok: true,
                pagina,
                total_paginas,
                total_usuarios,
                usuarios,
            });
        });
};

let crear = (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        telefono: body.telefono,
        password: bcrypt.hashSync(body.password, 10),
        creado: Date.now(),
        ultimoLogin: Date.now(),
        tecnico: body.tecnico,
        funcion: body.funcion,
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
};

let actualizar = (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ["nombre", "email", "telefono", "img", "tecnico", "funcion"]);

    Usuario.findByIdAndUpdate(id, body, QueryOpts, (err, usuarioDB) => {
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
    });
};

let eliminar = (req, res) => {
    let id = req.params.id;

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    let cambiaEstado = {
        estado: false,
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true, useFindAndModify: false }, (err, usuarioBorrado) => {
        if (err) {
            return res.json({
                ok: false,
                err,
            });
        }

        if (!usuarioBorrado) {
            return res.json({
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
    });
};

let buscar = (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, "i");

    Usuario.find({
            $or: [{ nombre: regex }, { email: regex }],
        })
        .populate("categoria", "descripcion")
        .exec((err, usuario) => {
            if (err) {
                return res.json({
                    ok: false,
                    err,
                });
            }

            if (Object.entries(usuario).length === 0) {
                return res.json({
                    ok: false,
                    message: "No se encontro el usuario",
                });
            }

            res.json({
                ok: true,
                usuario,
            });
        });
};

let verificar = (req, res) => {
    res.json({
        ok: true,
        usuario: req.usuario,
    });
};

let listarTecnicos = (req, res) => {
    let total_tecnicos = 0;

    Usuario.countDocuments({
            $and: [{ estado: true }, { tecnico: true }],
        },
        (err, numOfDocs) => {
            if (err) throw err;
            total_tecnicos = numOfDocs;
        }
    );

    Usuario.find({
        $and: [{ estado: true }, { tecnico: true }],
    }).exec((err, tecnicos) => {
        if (err) {
            return res.json({
                ok: false,
                err,
            });
        }

        if (Object.entries(tecnicos).length === 0) {
            return res.json({
                ok: false,
                message: "No se encontro el usuario",
            });
        }

        res.json({
            ok: true,
            total_tecnicos,
            tecnicos,
        });
    });
};

module.exports = {
    listar,
    crear,
    actualizar,
    eliminar,
    buscar,
    verificar,
    listarTecnicos,
};