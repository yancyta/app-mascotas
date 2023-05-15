const { Schema, model } = require('mongoose');
const VeterinarioSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    usuario: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    veterinaria: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Veterinaria'
    }
});
VeterinarioSchema.method('toJSON', function() { //configuracion del esquema, es solo para fines visuales no afecta la base de datos 
    const { _v, ...object } = this.toObject(); // aquí quitamos la forma de mongoos de poner el id y la versión
    return object;
});
module.exports = model('Veterinario', VeterinarioSchema);