const path = require('path'); // esto es de nodjs
const fs = require('fs');
const { response } = require('express');
const { v4: uuidv4 } = require('uuid'); // se instaló esta librería
const { actualizarImagen } = require('../helpers/actualizar-imagen');


const fileUpLoad = async(req, res = response) => {
    const tipo = req.params.tipo;
    const id = req.params.id;
    const tiposValidos = ['usuarios', 'veterinarios', 'veterinarias'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'El tipo no es correcto'
        });
    }
    // validamos que exista un archivo-----------------------
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay archivo'
        });
    }
    //------------------------------------------------------
    // procesar la imagen----------------------

    const file = req.files.imagen; // imagen, este es el nombre que ponemos en el form-data  
    const nombreCortado = file.name.split('.'); //
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];
    //----------------------------------------
    // validar extension ---------------------
    const extensionValida = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionValida.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: 'Extensión de archivo no permitido'
        });
    }
    //------------------------------------------
    // Generar el nombre del archivo----------------------
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;
    //----------------------------------------------------
    // path para guardar la imagen --------------------------
    const path = `./uploads/${tipo}/${nombreArchivo}`;
    //----------------------------------------------------
    // Use the mv() para mover el archivo o imagen------------
    file.mv(path, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover imagen'
            });

        }
        // Actualizar base de datos
        actualizarImagen(tipo, id, nombreArchivo);

        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        });
    });


}

const retornarImagen = (req, res = reponse) => {
    const tipo = req.params.tipo;
    const foto = req.params.foto;
    const pathImage = path.join(__dirname, `../uploads/${tipo}/${foto}`); // son 2gion bajo
    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        const pathImage = path.join(__dirname, `../uploads/NoImage.png`);
        res.sendFile(pathImage);
    }


}
module.exports = {
    fileUpLoad,
    retornarImagen
}