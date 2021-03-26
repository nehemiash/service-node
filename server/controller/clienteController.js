const Cliente = require("../models/clienteModel");

const _ = require("underscore");

const { QueryOpts } = require("../controller/dbconfig");

let listar = (req, res) => {
    let pagina = Number(req.query.pagina) || 1;
    let limite = Number(req.query.limite) || 20;
    let sort = req.query.sort || "nombre";

    let skip = pagina - 1;
    skip = skip * limite;
    let total_paginas;
    let total_clientes;

    Cliente.countDocuments({ estado: true }, (err, numOfDocs) => {
        if (err) throw err;
        total_paginas = Math.ceil(numOfDocs / limite);
        total_clientes = numOfDocs;
    });

    Cliente.find({ estado: true }, "-estado -creado")
        .skip(skip)
        .limit(limite)
        .sort(sort)
        .exec((err, clientes) => {
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
                total_clientes,
                clientes,
            });
        });
};

let crear = async(req, res) => {
    let body = req.body;

    let codigo;

    // trae el ultimo registro de la DB
    let ultimo = await Cliente.find({}, "-_id codigo").sort({ $natural: -1 }).limit(1).exec();
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

    let cliente = new Cliente({
        codigo: codigo,
        nombre: body.nombre,
        empresa: body.empresa,
        contacto: body.contacto,
        documento: body.documento,
        ruc: body.ruc,
        telefono: body.telefono,
        celular: body.celular,
        email: body.email,
        direccion: body.direccion,
        ciudad: body.ciudad,
        pais: body.pais,
        creado: Date.now(),
    });

    cliente.save((err, clienteDB) => {
        if (err) {
            return res.json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            cliente: clienteDB.nombre,
        });
    });
};

let actualizar = (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, [
        "nombre",
        "documento",
        "empresa",
        "contacto",
        "ruc",
        "telefono",
        "celular",
        "email",
        "direccion",
        "ciudad",
        "pais",
    ]);

    Cliente.findByIdAndUpdate(id, body, QueryOpts, (err, clienteDB) => {
        if (err) {
            return res.json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            cliente: clienteDB,
        });
    });
};

let eliminar = (req, res) => {
    let id = req.params.id;

    let cambiaEstado = {
        estado: false,
    };

    Cliente.findByIdAndUpdate(id, cambiaEstado, QueryOpts, (err, clienteBorrado) => {
        if (err) {
            return res.json({
                ok: false,
                err,
            });
        }

        if (!clienteBorrado) {
            return res.json({
                ok: false,
                err: {
                    message: "Ha ocurrido un error",
                },
            });
        }

        res.json({
            ok: true,
            cliente: clienteBorrado,
        });
    });
};

let buscar = (req, res) => {
    let termino = req.params.termino;

    if (isNaN(termino)) {
        let regex = new RegExp(termino, "i");
        Cliente.find({ estado: true, $or: [{ nombre: regex }, { email: regex }] }, "-estado -creado").exec(
            (err, clientes) => {
                if (err) {
                    return res.json({
                        ok: false,
                        message: "No se encontraron registros",
                        err,
                    });
                }

                if (Object.entries(clientes).length === 0) {
                    return res.json({
                        ok: false,
                        message: "No se encontraron registros",
                    });
                }

                res.json({
                    ok: true,
                    clientes,
                });
            }
        );
    } else {
        Cliente.find({ estado: true, $or: [{ documento: termino }, { codigo: termino }, { ruc: termino }] },
            "-estado -creado"
        ).exec((err, clientes) => {
            if (err) {
                return res.json({
                    ok: false,
                    message: "No se encontraron registros",
                    err,
                });
            }

            if (Object.entries(clientes).length === 0) {
                return res.json({
                    ok: false,
                    message: "No se encontraron registros",
                });
            }

            res.json({
                ok: true,
                clientes,
            });
        });
    }
};

let mostrarPorId = (req, res) => {
    let id = req.params.id;

    Cliente.findById(id).exec((err, cliente) => {
        if (err) {
            return res.json({
                ok: false,
                err,
            });
        }

        if (Object.entries(cliente).length === 0) {
            return res.json({
                ok: false,
                message: "No se encontro el registro",
            });
        }

        res.json({
            ok: true,
            cliente,
        });
    });
};

let mostrarPorDoc = (req, res) => {
    let doc = req.params.doc;

    Cliente.find({ estado: true, documento: doc }).exec((err, cliente) => {
        if (err) {
            return res.json({
                ok: false,
                err,
            });
        }

        if (Object.entries(cliente).length === 0) {
            return res.json({
                ok: false,
                message: "No se encontro el registro",
            });
        }

        res.json({
            ok: true,
            cliente,
        });
    });
};

module.exports = {
    listar,
    crear,
    actualizar,
    eliminar,
    buscar,
    mostrarPorId,
    mostrarPorDoc,
};