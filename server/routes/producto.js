const express = require("express");

const { verificaToken } = require("../middlewares/autenticacion");

let app = express();
const Producto = require("../models/producto");

// ===============================
// Mostrar todos los productos
// ===============================

app.get("/producto", verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .sort("nombre")
        .populate("categoria", "descripcion")

    .exec((err, productos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        res.json({
            ok: true,
            productos,
        });
    });
});

// ===============================
// Mostrar un producto por ID
// ===============================
app.get("/producto/:id", verificaToken, (req, res) => {
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

    Producto.findById(id)
        .populate("categoria", "descripcion")
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "ID no existe",
                    },
                });
            }

            res.json({
                ok: true,
                productoDB,
            });
        });
});

// ===============================
// Buscar un producto
// ===============================
app.get("/producto/buscar/:termino", verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, "i");

    Producto.find({ descripcion: regex })
        .populate("categoria", "descripcion")
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (Object.entries(productos).length === 0) {
                return res.status(400).json({
                    ok: false,
                    message: "No se encontraron Productos",
                });
            }

            res.json({
                ok: true,
                productos,
            });
        });
});

// ===============================
// Crear un producto
// ===============================
app.post("/producto", verificaToken, function(req, res) {
    let body = req.body;

    let producto = new Producto({
        descripcion: body.descripcion,
        numParte: body.numParte,
        marca: body.marca,
        categoria: body.categoria,
        modelo: body.modelo,
        color: body.color,
        configuracion: body.configuracion,
        disponible: true,
        img: body.img,
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            producto: productoDB,
        });
    });
});

// ===============================
// Actualizar un producto
// ===============================
app.put("/producto/:id", verificaToken, (req, res) => {
    // grabar usuario
    //grabar categoria del listado
    let id = req.params.id;
    let body = req.body;

    let actProducto = {
        numParte: body.numParte,
        descripcion: body.descripcion,
        marca: body.marca,
        categoria: body.categoria,
        modelo: body.modelo,
        color: body.color,
        configuracion: body.configuracion,
        img: body.img,
    };

    Producto.findByIdAndUpdate(
        id,
        actProducto, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
            context: "query", // esta opcion es para que reemplace un valor unique
        },
        (err, productoAct) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!actProducto) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Producto No encontrada",
                    },
                });
            }

            res.json({
                ok: true,
                Producto: productoAct,
            });
        }
    );
});

// ===============================
// Borrar un producto
// ===============================
app.delete("/producto/:id", verificaToken, (req, res) => {
    let id = req.params.id;

    let cambiaEstado = {
        disponible: false,
    };

    Producto.findByIdAndUpdate(
        id,
        cambiaEstado, { new: true, useFindAndModify: false },
        (err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: "ID invalido",
                    },
                });
            }

            if (!productoBorrado) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Producto No encontrado",
                    },
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
            });
        }
    );
});

module.exports = app;