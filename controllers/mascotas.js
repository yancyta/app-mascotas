const { response } = require('express');
const Mascota = require('../modelos/mascota');
const mascota = require('../modelos/mascota');


/*  Esta parte es el controlador para la ruta  */
const getMascotas = async(req, res = response) => {
    const mascotas = await Mascota.find().populate('', 'nombre'); // populate, para obtener informacion relacionada con el usurio  'nombre email'
        console.log('llega');     
            
        res.json({
            ok: true,
            mascotas

        });
    }
    /*--  controlador de la creación de veteri--*/

const crearMascota = async(req, res = response) => {
    const uid = req.uid;
    const mascota = new mascota({        
        ...req.body
    });

    try {

        const mascotaDB = await mascota.save();

        res.json({
            ok: true,
            crearMascota: mascotaDB
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error ...'
        })
    }
}


const actualizarMascota = async(req, res = response) => {
    const id = req.params.id;
  //  const uid = req.uid; // hay acceso a este porque se paso por la autenticación
    try {
        const mascota = await Mascota.findById(id);
        if (!mascota) {
            return res.status(404).json({
                ok: false,
                msg: 'Mascota no encontrada'
            });
        }
     //   console.log('body',req.body);
      //  console.log('mascota',mascota);
        const cambiosMascota = { //estos son los datos a actualizar
                ...req.body
              
            }
         //    console.log('cambios',cambiosMascota);
            //guardar cambios
        const mascotaActualizada = await Mascota.findByIdAndUpdate(id, cambiosMascota, { new: true, useFindAndModify: false });
        res.json({
            ok: true,
            mascota: mascotaActualizada
        });


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error en actualizar..'
        })
    }
}

const borrarMascota = async(req, res = response) => {
    const id = req.params.id;
    try {
        const mascota = await Mascota.findById(id);
        if (!mascota) {
            return res.status(404).json({
                ok: false,
                msg: 'Mascota no encontrada'
            });
        }
        await Veterinaria.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Mascota eliminada'
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
    getMascotas,
    crearMascota,
    actualizarMascota,
    borrarMascota
}