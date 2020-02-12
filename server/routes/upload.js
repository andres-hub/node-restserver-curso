const express = require('express');
const fileUpload = require('express-fileupload')
const app = express();
const Usuario = require('../models/usuario')
const Producto = require('../models/producto')
const fs = require('fs')
const path = require('path')

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo
    let id = req.params.id
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    menssage: 'no se a seleccionado ningun archivo'
                }
            });
    }
    let file = req.files.file
    let tipos = ['productos', 'usuarios']
    if (tipos.indexOf(tipo) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    menssage: 'los tipo permitidas son ' + tipos
                },
                tipo
            })
    }
    //Extensiones permitidas 
    let exs = ['png', 'jpg', 'gif', 'jpg']
    let nameFile = file.name.split('.')
    let ex = nameFile[nameFile.length - 1]
    if (exs.indexOf(ex) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    menssage: 'Las extensiones permitidas son ' + exs
                },
                extension: ex
            })
    }
    ///Cambiar nombre del archivo
    let name = `${id}-${new Date().getMilliseconds()}.${ex}`
    file.mv(`uploads/${tipo}/${name}`, (err) => {
        if (err)
            return res.status(500).json({ ok: false, err });
        if (tipo == "usuarios")
            imgUser(id, res, name, tipo)
        else
            imgproduct(id, res, name, tipo)
            //res.json({ ok: true, err: { message: "Carga exitosa" } });
    });
});

function imgUser(id, res, imgName, tipo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            deleteFile(imgName, tipo)
            return res.status(500).json({ ok: false, err })
        }
        if (!usuarioDB) {
            deleteFile(imgName, tipo)
            return res.status(400).json({
                ok: false,
                err: { menssage: 'usuario no existe' }
            })
        }
        deleteFile(usuarioDB.img, tipo)
        usuarioDB.img = imgName
        usuarioDB.save((err, usuarioUpdate) => {
            if (err) {
                return res.status(500).json({ ok: false, err });
            }
            res.json({
                ok: true,
                usuario: usuarioUpdate,
                img: imgName
            })
        })
    })
}

function deleteFile(nameFile, tipo) {
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${nameFile}`);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}

function imgproduct(id, res, imgName, tipo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            deleteFile(imgName, tipo)
            return res.status(500).json({ ok: false, err })
        }
        if (!productoDB) {
            deleteFile(imgName, tipo)
            return res.status(400).json({
                ok: false,
                err: { menssage: 'producto no existe' }
            })
        }
        deleteFile(productoDB.img, tipo)
        productoDB.img = imgName
        productoDB.save((err, productoUpdate) => {
            if (err) {
                return res.status(500).json({ ok: false, err });
            }
            res.json({
                ok: true,
                usuario: productoUpdate,
                img: imgName
            })
        })
    })
}


module.exports = app;