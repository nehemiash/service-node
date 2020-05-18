const express = require("express");

let {
    verificaToken,
    verificaAdmin_Role,
} = require("../middlewares/autenticacion");

let app = express();

const Nota = require("../models/nota");

// ===============================
// Mostrar todas las categorias
// ===============================
app.get("/nota", verificaToken, (req, res) => {
    Nota.find({ estado: true })
        .sort("creada")
        .populate("usuario", "nombre")
        .populate("sro", "numero")
        .populate("os", "numero")
        .exec((err, notas) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            res.json({
                ok: true,
                notas,
            });
        });
});

// //===============================
// // Mostrar una nota por ID
// //===============================
app.get("/nota/:id", verificaToken, (req, res) => {
    let id = req.params.id;

    // para validar si el ID ingresado es correcto
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "ID incorrecto",
            },
        });
    }

    Nota.findById(id, (err, notaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!notaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "El ID no es correcto",
                },
            });
        }

        res.json({
            ok: true,
            nota: notaDB,
        });
    });
});

//===============================
// Crear una nota
// //===============================
app.post("/nota", verificaToken, function(req, res) {
    let body = req.body;
    let nota = new Nota({
        descripcion: body.descripcion,
        usuario: req.usuario._id,
        origen: body.origen,
        sro: body.sro,
        os: body.os,
        creada: Date.now(),
    });

    nota.save((err, notaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!notaDB) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            nota: notaDB,
        });
    });
});

// //===============================
// // Actualizar una nota
// //===============================
app.put("/nota/:id", verificaToken, function(req, res) {
    let id = req.params.id;
    let body = req.body;

    let descNota = {
        descripcion: body.descripcion,
    };

    Nota.findByIdAndUpdate(
        id,
        descNota, { new: true, runValidators: true, useFindAndModify: false },
        (err, notaActualizada) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!notaActualizada) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Nota No encontrada",
                    },
                });
            }

            res.json({
                ok: true,
                nota: notaActualizada,
            });
        }
    );
});

// //===============================
// // Eliminar una catergorias
// //===============================
app.delete("/nota/:id", [verificaToken, verificaAdmin_Role], function(
    req,
    res
) {
    let id = req.params.id;

    Nota.findByIdAndRemove(id, (err, notaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!notaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El ID no existe",
                },
            });
        }

        res.json({
            ok: true,
            message: "Nota Borrada",
            nota: notaBorrada,
        });
    });
});

// =======================================================
// Buscar una categoria
// =======================================================
app.get("/nota/buscar/:termino", verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, "i");

    Nota.find({
        $or: [{ descripcion: regex }, { sro: regex }, { os: regex }],
    }).exec((err, nota) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (Object.entries(nota).length === 0) {
            return res.status(400).json({
                ok: false,

                message: "No se encontraron registros",
            });
        }

        res.json({
            ok: true,
            nota,
        });
    });
});

module.exports = app;