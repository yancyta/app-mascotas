const { response } = require('express');
const Veterinaria = require('../modelos/veterinaria');


/*  Esta parte es el controlador para la ruta  */
const getVeterinarias = async(req, res = response) => {
        const veterinarias = await Veterinaria.find().populate('usuario', 'nombre img'); // populate, para obtener informacion relacionada con el usurio  'nombre email'
        res.json({
            ok: true,
            veterinarias

        });
    }
    /*--  controlador de la creación de veteri--*/

const crearVeterinaria = async(req, res = response) => {
    const uid = req.uid;
    const veterinaria = new Veterinaria({
        usuario: uid,
        ...req.body
    });

    try {

        const veterinariaDB = await veterinaria.save();

        res.json({
            ok: true,
            crearVeterinaria: veterinariaDB
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error ...'
        })
    }
}


const actualizarVeterinaria = async(req, res = response) => {
    const id = req.params.id;
    const uid = req.uid; // hay acceso a este porque se paso por la autenticación
    try {
        const veterinaria = await Veterinaria.findById(id);
        if (!veterinaria) {
            return res.status(404).json({
                ok: false,
                msg: 'Veterinaria no encontrada'
            });
        }
        const cambiosVeterinaria = { //estos son los datos a actualizar
                ...req.body,
                usuario: uid
            }
            //guardar cambios
        const veterinariaActualizada = await Veterinaria.findByIdAndUpdate(id, cambiosVeterinaria, { new: true, useFindAndModify: false });
        res.json({
            ok: true,
            veterinaria: veterinariaActualizada
        });


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error en actualizar..'
        })
    }
}

const borrarVeterinaria = async(req, res = response) => {
    const id = req.params.id;
    try {
        const veterinaria = await Veterinaria.findById(id);
        if (!veterinaria) {
            return res.status(404).json({
                ok: false,
                msg: 'Veterinaria no encontrada'
            });
        }
        await Veterinaria.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Veterinaria eliminada'
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
    getVeterinarias,
    crearVeterinaria,
    actualizarVeterinaria,
    borrarVeterinaria
}