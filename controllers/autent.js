const { response } = require('express');
const encriptar = require('bcryptjs');
const Usuario = require('../modelos/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFronend } = require('../helpers/menu-fronend');

const login = async(req, res = response) => {
    const { email, password } = req.body;
    try {
        //verificar email
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Autenticación  no valida'
            });
        }
        //verificar contraseña si hace match
        const validarPassword = encriptar.compareSync(password, usuarioDB.password); //compara y  devuelve un boolean
        if (!validarPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Autenticación  no valida'
            });
        }
        // tokend
        // generar el token, autenticacion pasiva el backend va a verificar el tokend para dar entrada al usurio, el tokend consta de 3 partes ver https://jwt.io/
        const token = await generarJWT(usuarioDB.id,usuarioDB.email);
        // los token los utilizaresmos para validar las rutas
        res.json({
            ok: true,
            uid:usuarioDB.id,
            email:usuarioDB.email,
            token,
            menu: getMenuFronend(usuarioDB.rol)
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado..!'
        });
    }
}
const googleSignIn = async(req, res = response) => {
    const googleToken = req.body.token;
    try {
        const { name, email, picture } = await googleVerify(googleToken);
        const usuarioDB = await Usuario.findOne({ email });
        let usuario;
        if (!usuarioDB) { //si no existe el usuario
            usuario = new Usuario({
                nombre: name,
                email, // en ESC6 es redundante poner email:email
                password: '@@@',
                img: picture,
                google: true
            });
        } else {
            usuario = usuarioDB;
            usuario.google = true;
        }
        //guardamos en la base de datos
        await usuario.save();
        //generar jsonwebtoken
        const token = await generarJWT(usuario.id);
        res.json({
            ok: true,
            token,
            menu: getMenuFronend(usuario.rol)
        });
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'token no es correcto..!'
        })
    }
}


const renewToken = async(req, res = response) => {
    const {uid,email} = req;
   // const tokena=req.header('x-token');
    //console.log(tokena);
    //generar token
    const token = await generarJWT(uid,email);
   
    const usuario = await Usuario.findById(uid);
   
  return  res.json({
        ok: true,
        token,
        usuario,
        menu: getMenuFronend(usuario.rol)
    });
}
module.exports = {
    login,
    googleSignIn,
    renewToken
}