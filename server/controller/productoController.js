const Producto = require("../models/productoModel");
const _ = require("underscore");
const { QueryOpts } = require("../controller/dbconfig");

let listar = (req, res) => {
    let pagina = Number(req.query.pagina) || 1;
    let limite = Number(req.query.limite) || 30;
    let sort = req.query.sort;

    let skip = pagina - 1;
    skip = skip * limite;
    let total_paginas;
    let total_prod;

    Producto.countDocuments({ estado: true }, (err, numOfDocs) => {
        if (err) throw err;
        total_paginas = Math.ceil(numOfDocs / limite);
        total_prod = numOfDocs;
    });

    Producto.find({ estado: true })
        .skip(skip)
        .limit(limite)
        .sort(sort)
        .populate("categoria", "descripcion")

    .exec((err, productos) => {
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
            total_prod,
            productos,
        });
    });
};

let marcas = (req, res) => {
    Producto.aggregate([{ $unwind: "$marca" }, { $group: { _id: "$marca" } }])
        .sort({ _id: "asc" })
        .collation({ locale: "en", strength: 1 })
        .exec(function(err, marcas) {
            if (err) {
                return res.json(err);
            }
            res.json({
                marcas,
            });
        });
};

let mostrarPorId = (req, res) => {
    let id = req.params.id;

    // para validar si el ID ingresado es correcto
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.json({
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
                return res.json({
                    ok: false,
                    err,
                });
            }

            if (!productoDB) {
                return res.json({
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
};

let buscar = (req, res) => {
    let termino = req.params.termino;
    let pagina = Number(req.query.pagina) || 1;
    let limite = Number(req.query.limite) || 15;
    let sort = req.query.sort || "codigo";

    let skip = pagina - 1;
    skip = skip * limite;

    let total_paginas;
    let total_prod;

    Producto.countDocuments({ estado: true }, (err, numOfDocs) => {
        if (err) throw err;
        total_paginas = Math.ceil(numOfDocs / limite);
        total_prod = numOfDocs;
    });

    let regex = new RegExp(termino, "i");

    Producto.find({
            estado: true,
            $or: [{ descripcion: regex }, { numParte: termino }, { codigo: termino }, { marca: regex }, { modelo: regex }],
        })
        .skip(skip)
        .limit(limite)
        .populate("categoria", "descripcion")
        .sort(sort)
        .exec((err, productos) => {
            if (err) {
                return res.json({
                    ok: false,
                    err,
                });
            }

            if (Object.entries(productos).length === 0) {
                return res.json({
                    ok: false,
                    message: "No se encontraron Productos",
                });
            }

            res.json({
                ok: true,
                pagina,
                total_paginas,
                total_prod,
                productos,
            });
        });
};

let crear = async(req, res) => {
    let body = req.body;

    let codigo;

    // trae el ultimo registro de la DB
    let ultimo = await Producto.find({}, "-_id codigo").sort({ $natural: -1 }).limit(1).exec();
    // convierte a numero e incrementa
    if (ultimo.length > 0) {
        ultimo = ultimo.toString(); // convierte el objeto a string
        ultimo = parseInt(ultimo.replace(/\D/g, ""));
        codigo = ultimo + 1;
    }
    // si no hay ultimo registro comienza en 1
    if (ultimo.length === 0) {
        codigo = 1;
    }

    let producto = new Producto({
        descripcion: body.descripcion,
        codigo: codigo,
        numParte: body.numParte,
        marca: body.marca,
        modelo: body.modelo,
        categoria: body.categoria,
        img: body.img,
    });

    producto.save(async(err, productoDB) => {
        await producto.populate("Categoria", "descripcion").execPopulate();

        if (err) {
            return res.json({
                ok: false,
                err,
            });
        }
        if (!productoDB) {
            return res.json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            productoDB,
        });
    });
};

let actualizar = (req, res) => {
    let id = req.params.id;

    let body = _.pick(req.body, ["descripcion", "numParte", "marca", "modelo", "categoria", "img"]);

    Producto.findByIdAndUpdate(id, body, QueryOpts, (err, productoAct) => {
        if (err) {
            return res.json({
                ok: false,
                err,
            });
        }

        if (!productoAct) {
            return res.json({
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
    });
};

let eliminar = (req, res) => {
    let id = req.params.id;

    let cambiaEstado = {
        estado: false,
    };

    Producto.findByIdAndUpdate(id, cambiaEstado, QueryOpts, (err, productoBorrado) => {
        if (err) {
            return res.json({
                ok: false,
                err: {
                    message: "ID invalido",
                },
            });
        }

        if (!productoBorrado) {
            return res.json({
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
    });
};

module.exports = {
    listar,
    mostrarPorId,
    buscar,
    crear,
    actualizar,
    eliminar,
    marcas,
};