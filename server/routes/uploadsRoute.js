const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const Usuario = require("../models/usuarioModel");
const Producto = require("../models/productoModel");
const fs = require("fs");
const path = require("path");

/* Middleware que hace que cualquier archivo que se suba lo sube a req.file */
app.use(fileUpload());

app.put("/upload/:tipo/:id", function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.json({
            ok: false,
            err: {
                message: "Ningun archivo ha sido subido",
            },
        });
    }

    /* Validar tipo */

    let tiposValidos = ["productos", "usuarios"];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.json({
            ok: false,
            err: {
                message: "Los tipos permitidos son: " + tiposValidos.join(", "),
            },
        });
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split(".");
    let ext = nombreCortado[nombreCortado.length - 1];
    let extension = ext.toLowerCase();

    /* extensiones permitidas */
    let extensionesValidas = ["png", "jpg", "gif", "jpeg"];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.json({
            ok: false,
            err: {
                message: "Las extensiones permitidas son: " + extensionesValidas.join(", "),
                ext: extension,
            },
        });
    }

    /* Cambiar el nombre al archivo */
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.json({
                err,
            });

        /* aqui la imagen ya se cargo al File System */
        if (tipo === "usuarios") {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }
    });
});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, "usuarios");
            return res.json({
                ok: false,
                err,
            });
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, "usuarios");
            return res.json({
                ok: false,
                err: {
                    message: "El usuario no existe",
                },
            });
        }

        borraArchivo(usuarioDB.img, "usuarios");

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
            });
        });
    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, "productos");
            return res.json({
                ok: false,
                err,
            });
        }

        if (!productoDB) {
            borraArchivo(nombreArchivo, "productos");
            return res.json({
                ok: false,
                err: {
                    message: "El producto no existe",
                },
            });
        }

        borraArchivo(productoDB.img, "productos");

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
            });
        });
    });
}

function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;