const { response } = require('express');
const Veterinario = require('../modelos/veterinario');


/*  Esta parte es el controlador para la ruta  */
const getVeterinarios = async(req, res = response) => {
        const veterinarios = await Veterinario.find()
            .populate('usuario', 'nombre img')
            .populate('veterinaria', 'nombre img');

        res.json({
            ok: true,
            veterinarios

        });
    }
    /*  Esta parte es el controlador para la ruta  */
    //http: / / localhost: 3000 / api / veterinarios / 60fe5e2e33d4bf4504038d51
const getVeterinarioById = async(req, res = response) => {
        const id = req.params.id;
        try {
            const veterinario = await Veterinario.findById(id)
                .populate('usuario', 'nombre img')
                .populate('veterinaria', 'nombre img');

            res.json({
                ok: true,
                veterinario
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'Error  al obtener veterinario'
            })
        }
    }
    /*--  controlador de la creación de veteri--*/

const crearVeterinario = async(req, res = response) => {
    const uid = req.uid;
    const veterinario = new Veterinario({
        usuario: uid,
        ...req.body
    });

    try {
        const veterinarioDB = await veterinario.save();
        res.json({
            ok: true,
            veterinario: veterinarioDB
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error  al crear'
        })
    }
}


const actualizarVeterinario = async(req, res = response) => {
    const id = req.params.id;
    const uid = req.uid;
    try {
        const veterinario = await Veterinario.findById(id);
        if (!veterinario) {
            return res.status(404).json({
                ok: false,
                msg: 'Veterinario no encontrado'
            });
        }
        const cambiosVeterinario = { //estos son los datos a actualizar
                ...req.body,
                usuario: uid
            }
            //guardar cambios
        const veterinarioActualizado = await Veterinario.findByIdAndUpdate(id, cambiosVeterinario, { new: true, useFindAndModify: false });

        res.json({
            ok: true,
            veterinario: veterinarioActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error en actualizar..'
        })
    }
}

const borrarVeterinario = async(req, res = response) => {
    const id = req.params.id;
    try {
        const veterinario = await Veterinario.findById(id);
        if (!veterinario) {
            return res.status(404).json({
                ok: false,
                msg: 'Veterinario no encontrado'
            });
        }
        await Veterinario.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'veterinario eliminado'
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
    getVeterinarios,
    crearVeterinario,
    actualizarVeterinario,
    borrarVeterinario,
    getVeterinarioById
}