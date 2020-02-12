const jwt = require('jsonwebtoken')
    //=====================================
    //Verificar Token 
    //=====================================
let verificaToken = (req, res, next) => {
    //console.log('Request URL:', req.originalUrl);
    //console.log('Request Type:', req.method);
    let token = req.get('token')
    jwt.verify(token, process.env.SEED, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    ok: false,
                    err: {
                        message: 'Token no valido'
                    }
                })
            }
            req.usuario = decoded.usuario
            next()
        })
        //console.log(token);

}

//=====================================
//Verificar Rol 
//=====================================
let verificaRol = (req, res, next) => {
    let usuario = req.usuario
    if (usuario.role === 'ADMIN_ROLE') {
        next()
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    }

};
//=====================================
//Verificar token img
//=====================================
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }
        req.usuario = decoded.usuario
        next()
    })
};
module.exports = {
    verificaToken,
    verificaRol,
    verificaTokenImg
}