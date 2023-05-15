 const { response } = require('express');
 const encriptar = require('bcryptjs');
 const Usuario = require('../modelos/usuario');
 const { generarJWT } = require('../helpers/jwt');

 /*  Esta parte es el controlador para la ruta  */
 const getUsuarios = async(req, res) => {
         const desde = Number(req.query.desde) || 0;
         // const usuarios = await Usuario.find({}, 'nombre email role google').skip(desde).limit(5); // obtenemos todo los registros desde hasta el limite
         //const total = await Usuario.count(); // contar los registros
         const [usuarios, total] = await Promise.all([
             Usuario.find({}, 'nombre email rol google img').skip(desde).limit(10),
             Usuario.countDocuments() // obtiene el total de registros
         ]);

         res.json({
             ok: true,
             usuarios,
             //  uid: req.uid   , con esta linea podemos compartir información en las peticiones.
             total
         });
     }
     /*--  controlador de la creación de usuario--*/

 const crearUsuario = async(req, res = response) => {
     const { email, password } = req.body;
     try {
         const existeEmail = await Usuario.findOne({ email });
         if (existeEmail) {
             return res.status(400).json({
                 ok: false,
                 msg: 'El corrreo ya esta registrado'
             });
         }

         const usuario = new Usuario(req.body);
         // encriptar contraseña
         const salt = encriptar.genSaltSync();
         usuario.password = encriptar.hashSync(password, salt);

         //guardar usuario
         await usuario.save(); // Esto es lo que graba en la base de datos

         //generar token JWT
         const token = await generarJWT(usuario.id,usuario.email);
         res.json({
             ok: true,
             usuario,
             token
         });
     } catch (error) {
         console.log(error);
         res.status(500).json({
             ok: false,
             msg: 'Error ...'
         })
     }
 }


 const actualizarUsuario = async(req, res = response) => {
     //  comprobar si es el usuario correcto y validar el token
     const uid = req.params.id;
     const userId = req.uid;
     try {
         const usuarioDB = await Usuario.findById(uid);

         if (!usuarioDB) {
             return res.status(404).json({
                 ok: false,
                 msg: 'No existe un usuario con ese id'
             });
         }

         // actualizar
         // desestructuramos, así podemos quitar el password google y email 
         const { password, google, email, ...campos } = req.body;

         if (usuarioDB.email !== email) {
             const existeEmail = await Usuario.findOne({ email });
             if (existeEmail) {
                 return res.status(400).json({
                     ok: false,
                     msg: 'Ya existe un usuario con ese email..'
                 });
             }
         }

         if (!usuarioDB.google || (usuarioDB.google && userId != uid)) {
             campos.email = email;
             // delete campos.password; // borramos el campo que no nos interesa actualizar
             //   delete campos.google;
             const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });
             res.json({
                 ok: true,
                 usuario: usuarioActualizado
             });
         } else {
             return res.status(400).json({
                 ok: false,
                 msg: 'Usuarios de google no pueden cambiar sus datos'
             })
         }


     } catch (error) {
         console.log(error);
         res.status(500).json({
             ok: false,
             msg: 'Error en actualizar..'
         })
     }
 }

 const borrarUsuario = async(req, res = response) => {
     const uid = req.params.id;
     try {

         const usuarioDB = await Usuario.findById(uid);

         if (!usuarioDB) {
             return res.status(404).json({
                 ok: false,
                 msg: 'No existe un usuario con ese id'
             });
         }
         await Usuario.findByIdAndDelete(uid);

         res.json({
             ok: true,
             msg: 'Usuario eliminado'
         });
     } catch (error) {
         console.log(error);
         res.status(500).json({
             ok: false,
             msg: 'Error al eliminar..'
         })
     }

 }


 module.exports = {
     getUsuarios,
     crearUsuario,
     actualizarUsuario,
     borrarUsuario
 }