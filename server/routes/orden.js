const express = require("express");
const _ = require("underscore");

let {
    verificaToken,
    verificaAdmin_Role,
} = require("../middlewares/autenticacion");

let app = express();

const Orden = require("../models/orden");

// ===============================
// Mostrar todas las categorias
// ===============================
app.get("/orden", verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);

    Orden.find({ completada: false })
        .skip(desde)
        .limit(limite)
        .sort("creado")
        .populate("producto", "descripcion")
        .populate("cliente", "nombre")
        .populate("sro", "numero numeroGSX")
        .populate("presupuesto", "valorTotal")
        .exec((err, ordenes) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            res.json({
                ok: true,
                ordenes,
            });
        });
});

// //===============================
// // Mostrar una nota por ID
// //===============================
app.get("/orden/:id", verificaToken, (req, res) => {
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

    Orden.findById(id)
        .populate("centro", "nombre")
        .populate("producto", "descripcion")
        .populate("cliente", "nombre")
        .populate("usuario", "nombre")
        .populate("sro", "numero numeroGSX ")
        .populate("nota", "creada decripcion")
        .populate("tecnico", "usuario")
        .populate(
            "presupuesto",
            "numero stock parteapple valorMO valorFlete valorTotal aprobado"
        )
        .exec((err, ordenDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!ordenDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: "El ID no es correcto",
                    },
                });
            }

            res.json({
                ok: true,
                orden: ordenDB,
            });
        });
});

//===============================
// Crear una orden
// //===============================
app.post("/orden", verificaToken, function(req, res) {
    let body = req.body;
    let usuario = req.usuario._id;

    let orden = new Orden({
        numero: body.numero,
        centro: body.centro,
        creado: Date.now(),
        serie: body.serie,
        imei: body.imei,
        sustituido: body.sustituido,
        producto: body.producto,
        fechaCompra: body.fechaCompra,
        cobertura: body.cobertura,
        cliente: body.cliente,
        estado: body.estado,
        ubicacion: body.ubicacion,
        accesorios: body.accesorios,
        problema: body.problema,
        aspecto: body.aspecto,
        tecnico: body.tecnico,
        sro: body.sro,
        nota: body.nota,
        presupuesto: body.presupuesto,
        completada: false,
        usuario: usuario,
    });

    orden.save((err, ordenDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!ordenDB) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            orden: ordenDB,
        });
    });
});

// //===============================
// // Actualizar una orden
// //===============================
app.put("/orden/:id", verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, [
        "sustituido",
        "fechaCompra",
        "cobertura",
        "estado",
        "ubicacion",
        "accesorios",
        "problema",
        "aspecto",
        "servRealizado",
        "tecnico",
        "sro",
        "nota",
        "informe",
        "presupuesto",
    ]);

    Orden.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    }).exec((err, ordenAct) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!ordenAct) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Orden no encontrada",
                },
            });
        }

        res.json({
            ok: true,
            orden: ordenAct,
        });
    });
});

// //===============================
// // Entregar una orden
// //===============================
app.put("/orden/entregar/:id", [verificaToken], function(req, res) {
    let id = req.params.id;

    let entregar = {
        completada: true,
        entregado: Date.now(),
    };

    Orden.findByIdAndUpdate(
        id,
        entregar, { new: true, useFindAndModify: false },
        (err, ordenAct) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            if (!ordenAct) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "orden no encontrada",
                    },
                });
            }

            res.json({
                ok: true,
                orden: ordenAct,
            });
        }
    );
});

// ===============================
// Buscar un orden
// ===============================
app.get("/orden/buscar/:termino", verificaToken, (req, res) => {
    let termino = req.params.termino;

    if (isNaN(termino)) {
        nan = 0;
    } else {
        nan = termino;
    }

    Orden.find({
            $or: [
                { numero: nan },
                { serie: termino },
                { imei: termino },
                { sustituido: termino },
            ],
        })
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

module.exports = app;