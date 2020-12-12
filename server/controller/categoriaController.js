const _ = require("underscore");

const Categoria = require("../models/categoriaModel");

const { QueryOpts } = require("../controller/dbconfig");

let listar = (req, res) => {
    Categoria.find({ estado: true })
        .sort("descripcion")
        .exec((err, categorias) => {
            if (err) {
                return res.json({
                    ok: false,
                    err,
                });
            }
            res.json({
                ok: true,
                categorias,
            });
        });
};

let listarSort = (req, res) => {
    let sort = req.params.sort;
    Categoria.find({ tipo: sort, estado: true })
        .sort("descripcion")
        .exec((err, categorias) => {
            if (err) {
                return res.json({
                    ok: false,
                    err,
                });
            }
            res.json({
                categorias,
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

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.json({
                ok: false,
                err,
            });
        }

        if (!categoriaDB) {
            return res.json({
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
};

let agregar = (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        tipo: body.tipo,
        icon: body.icon,
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.json({
                ok: false,
                err,
            });
        }

        if (!categoriaDB) {
            return res.json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            categorias: categoriaDB,
        });
    });
};

let actualizar = (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ["descripcion", "icon", "tipo"]);

    Categoria.findByIdAndUpdate(id, body, QueryOpts, (err, categoriaActualizada) => {
        if (err) {
            return res.json({
                ok: false,
                err,
            });
        }

        if (!categoriaActualizada) {
            return res.json({
                ok: false,
                err: {
                    message: "Categoria no encontrada",
                },
            });
        }

        res.json({
            ok: true,
            categoria: categoriaActualizada,
        });
    });
};

let eliminar = (req, res) => {
    let id = req.params.id;

    let cambiaEstado = {
        estado: false,
    };

    Categoria.findByIdAndUpdate(id, cambiaEstado, QueryOpts, (err, categoriaBorrada) => {
        if (err) {
            return res.json({
                ok: false,
                err,
            });
        }

        if (!categoriaBorrada) {
            return res.json({
                ok: false,
                err: {
                    message: "Categoria No encontrada",
                },
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada,
        });
    });
};

let buscar = (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, "i");

    Categoria.find({ descripcion: regex, estado: true }).exec((err, categoria) => {
        if (err) {
            return res.json({
                ok: false,
                err,
            });
        }

        if (Object.entries(categoria).length === 0) {
            return res.json({
                ok: false,
                message: "No se encontraron registros",
            });
        }

        res.json({
            ok: true,
            categoria: categoria,
        });
    });
};

module.exports = {
    listar,
    mostrarPorId,
    agregar,
    actualizar,
    eliminar,
    buscar,
    listarSort,
};