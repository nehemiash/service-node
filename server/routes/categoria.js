const express = require("express");

let {
    verificaToken,
    verificaAdmin_Role,
} = require("../middlewares/autenticacion");

let app = express();

const Categoria = require("../models/categoria");

// ===============================
// Mostrar todas las categorias
// ===============================
app.get("/categoria", verificaToken, (req, res) => {
    Categoria.find({ estado: true })
        .sort("descripcion")
        .populate("usuario", "nombre")
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            res.json({
                ok: true,
                categorias,
            });
        });
});

// //===============================
// // Mostrar una catergorias por ID
// //===============================
app.get("/categoria/:id", verificaToken, (req, res) => {
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

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "El ID no es correcto",
                },
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB,
        });
    });
});

//===============================
// Crear una catergoria
// //===============================
app.post("/categoria", verificaToken, function(req, res) {
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id,
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB,
        });
    });
});

// //===============================
// // Actualizar una catergorias
// //===============================
app.put("/categoria/:id", verificaToken, function(req, res) {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion,
    };

    Categoria.findByIdAndUpdate(
        id,
        descCategoria, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
            context: "query", // esta opcion es para que reemplace un valor unique
        },
        (err, categoriaActualizada) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!categoriaActualizada) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Categoria No encontrada",
                    },
                });
            }

            res.json({
                ok: true,
                Categoria: categoriaActualizada,
            });
        }
    );
});

// //===============================
// // Eliminar una catergorias
// //===============================
app.delete("/categoria/:id", [verificaToken], function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: false,
    };

    Categoria.findByIdAndUpdate(
        id,
        cambiaEstado, { new: true, useFindAndModify: false },
        (err, categoriaBorrada) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            if (!categoriaBorrada) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Cliente No encontrado",
                    },
                });
            }

            res.json({
                ok: true,
                cliente: categoriaBorrada,
            });
        }
    );
});

// =======================================================
// Buscar una categoria
// =======================================================
app.get("/categoria/buscar/:termino", verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, "i");

    Categoria.find({ descripcion: regex }).exec((err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (Object.entries(categoria).length === 0) {
            return res.status(400).json({
                ok: false,
                message: "No se encontraron registros",
            });
        }

        res.json({
            ok: true,
            categoria,
        });
    });
});

module.exports = app;