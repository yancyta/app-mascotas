const fs = require('fs'); // con esto podemos leer las carpetas y archivos
const Usuario = require('../modelos/usuario');
const Veterinaria = require('../modelos/veterinaria');
const Veterinario = require('../modelos/veterinario');
const borrarImagen = (path) => {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path); // borra la imagen anterior
    }
}
const actualizarImagen = async(tipo, id, nombreArchivo) => {
    let pathViejo = '';
    switch (tipo) {
        case 'veterinarios':
            const veterinario = await Veterinario.findById(id);
            if (!veterinario) {
                console.log('No es un veterinario');
                return false;
            }
            pathViejo = `./uploads/veterinarios/${veterinario.img}`;
            borrarImagen(pathViejo);
            veterinario.img = nombreArchivo;
            await veterinario.save();
            return true;
        case 'veterinarias':
            const veterinaria = await Veterinaria.findById(id);
            if (!veterinaria) {
                console.log('No es una veterinaria');
                return false;
            }
            pathViejo = `./uploads/veterinarias/${veterinaria.img}`;
            borrarImagen(pathViejo);
            veterinaria.img = nombreArchivo;
            await veterinaria.save();
            return true;
        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if (!usuario) {
                console.log('No es un usuario');
                return false;
            }
            pathViejo = `./uploads/usuarios/${usuario.img}`;
            borrarImagen(pathViejo);
            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
        default:
            return res.status(400).json({
                ok: false,
                msg: 'La tabla tiene que ser usuarios/veterinarios/veterinarias'
            });
    }


}
module.exports = {
    actualizarImagen
}