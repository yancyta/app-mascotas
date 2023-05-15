const { Schema, model } = require('mongoose');
const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        default: false
    },
    resetToken:{
        type: String,
    }

});
UsuarioSchema.method('toJSON', function() { //configuracion del esquema, es solo para fines visuales no afecta la base de datos 
    const { _v, _id, password, ...object } = this.toObject(); // aquí quitamos la forma de mongoos de poner el id y la versión
    object.uid = _id; //esto es opcional
    return object;
});
module.exports = model('Usuario', UsuarioSchema);