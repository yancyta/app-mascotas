//getTodo
const { response } = require('express');
const Usuario = require('../modelos/usuario');
const Veterinaria = require('../modelos/veterinaria');
const Veterinario = require('../modelos/veterinario');
/*  Esta parte es el controlador para la ruta  */
const getTodo = async(req, res = response) => {
    const busqueda = req.params.busqueda;
    const regExp = new RegExp(busqueda, 'i')

    const [usuarios, veterinarias, veterinarios] = await Promise.all([
        Usuario.find({ nombre: regExp }),
        Veterinaria.find({ nombre: regExp }),
        Veterinario.find({ nombre: regExp })
    ]);
    res.json({
        ok: true,
        usuarios,
        veterinarias,
        veterinarios
    });
}
const getDocumentosColeccion = async(req, res = response) => {
    // const desde = Number(req.query.desde) || 0; //agregue
    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regExp = new RegExp(busqueda, 'i');
    let data = [];
    switch (tabla) {
        case 'veterinarios':
            data = await Veterinario.find({ nombre: regExp })
                .populate('usuario', 'nombre img')
                .populate('veterinaria', 'nombre img');
            break;
        case 'veterinarias':
            data = await Veterinaria.find({ nombre: regExp }).populate('usuario', 'nombre  img');
            break;
        case 'usuarios':
            data = await Usuario.find({ nombre: regExp }); //.skip(desde).limit(5); //modifique

            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: 'La tabla tiene que ser usuarios/veterinarios/veterinarias'
            });
    }
    res.json({
        ok: true,
        resultados: data
    });


}

module.exports = {
    getTodo,
    getDocumentosColeccion
}