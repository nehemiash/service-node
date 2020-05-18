const express = require("express");

const Cliente = require("../models/cliente");

const _ = require("underscore");

const {
    verificaToken,
    verificaAdmin_Role,
} = require("../middlewares/autenticacion");

const app = express();

/* Listar todos los clientes */

app.get("/cliente", verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);

    Cliente.find({ estado: true },
            "nombre documento ruc telefono email direccion ciudad pais creado"
        )
        .skip(desde)
        .limit(limite)
        .sort("nombre")
        .exec((err, clientes) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            Cliente.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    clientes,
                    cuantos: conteo,
                });
            });
        });
});

/* Crear un nuevo cliente */

app.post("/cliente", [verificaToken], function(req, res) {
    let body = req.body;

    let cliente = new Cliente({
        nombre: body.nombre,
        documento: body.documento,
        ruc: body.ruc,
        telefono: body.telefono,
        email: body.email,
        direccion: body.direccion,
        ciudad: body.ciudad,
        pais: body.pais,
        creado: Date.now(),
    });

    cliente.save((err, clienteDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            cliente: clienteDB,
        });
    });
});

app.put("/cliente/:id", [verificaToken], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, [
        "nombre",
        "documento",
        "ruc",
        "telefono",
        "email",
        "direccion",
        "ciudad",
        "pais",
    ]);

    Cliente.findByIdAndUpdate(
        id,
        body, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
            context: "query", // esta opcion es para que reemplace un valor unique
        },
        (err, clienteDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            res.json({
                ok: true,
                cliente: clienteDB,
            });
        }
    );
});

app.delete("/cliente/:id", [verificaToken, verificaAdmin_Role], function(
    req,
    res
) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: false,
    };

    Cliente.findByIdAndUpdate(
        id,
        cambiaEstado, { new: true, useFindAndModify: false },
        (err, clienteBorrado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            if (!clienteBorrado) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Cliente No encontrado",
                    },
                });
            }

            res.json({
                ok: true,
                cliente: clienteBorrado,
            });
        }
    );
});

// =======================================================
// Buscar una cliente por descripcion, numero de parte o SKU
// =======================================================
app.get("/cliente/buscar/:termino", verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, "i");

    Cliente.find({
        $or: [{ nombre: regex }, { documento: termino }, { email: regex }],
    }).exec((err, cliente) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (Object.entries(cliente).length === 0) {
            return res.status(400).json({
                ok: false,
                message: "No se encontraron registros",
            });
        }

        res.json({
            ok: true,
            cliente,
        });
    });
});

module.exports = app;