const express = require('express')
const bcrypt = require('bcryptjs')
const _ = require('underscore')
const app = express()
const Usuario = require('../models/usuario')

app.get('/usuario', function(req, res) {
    let desde = req.query.desde || 0
    desde = Number(desde)
    let limite = req.query.limite || 5
    limite = Number(limite)
    Usuario.find({ estado: true }, 'nombre email img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })
            })
        })

})

app.post('/usuario', function(req, res) {
    let body = req.body
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

    // if (data.nombre == undefined) {
    //     res.status(400).json({
    //         ok: false,
    //         msj: 'El nombre es necesario'
    //     })
    // }
    // res.send({ person: data })
})

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id
    let body = _.pick(req.body, ['nombre', 'role', 'email', 'estado'])


    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

})

app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id
        // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    let combioEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, combioEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    menssge: "El usuario no se encontro"
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })

})

module.exports = app