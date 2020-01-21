require('./config/config')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/usuario', function(req, res) {
    res.send('get usuario')
})

app.post('/usuario', function(req, res) {
    let data = req.body
    if (data.nombre == undefined) {
        res.status(400).json({
            ok: false,
            msj: 'El nombre es necesario'
        })
    }
    res.send({ person: data })
})

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id
    res.json({ id })
})

app.delete('/usuario', function(req, res) {
    res.send('delete usuario')
})

app.listen(process.env.PORT, () => { console.log(`escuchando puerto ${process.env.PORT}`) })