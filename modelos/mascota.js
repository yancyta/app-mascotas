const { Schema, model } = require('mongoose');
const MascotaSchema = Schema({
    raza: {
        type: String,
        required: true
    },
    des: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    origen: {
        type: String,
        required: true
    },
    peso: {
        type: String,
        required: true
    },
    guardian: {
        type: String,
        required: true
    },
    salud: {
        type: String,
        required: true
    },
    ejercicio: {
        type: String,
        required: true
    },
    nutricion: {
        type: String,
        required: true
    },
    puntaje: {
        type: Number,
        required: true
    }
  
}, { collection: 'mascotas' });
MascotaSchema.method('toJSON', function() { //configuracion del esquema, es solo para fines visuales no afecta la base de datos 
    const { _v, ...object } = this.toObject(); // aquí quitamos la forma de mongoos de poner el id y la versión
    return object;
});
module.exports = model('Mascota', MascotaSchema);