/* ruta:   /api/mascotas  */
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const {
    getMascotas,
    crearMascota,
    actualizarMascota,
    borrarMascota
} = require('../controllers/mascotas');

const router = Router();
/*--ruta para obtener  vaterinarias--*/
router.get('/', getMascotas);

/*--ruta para agregar una veterinaria--*/
router.post('/', [
    validarJWT, 
    check('raza', 'Se requiere la raza').not().isEmpty(),
    check('des', 'Se requiere una descripciòn').not().isEmpty(),
    check('origen', 'El origen es obligatoria').not().isEmpty(),
    check('peso', 'El peso es obligatorio').not().isEmpty(),
    check('guardian', 'Campo es obligatorio').not().isEmpty(),
    check('salud', 'Campo obligatorio').not().isEmpty(),
    check('ejercicio', 'Campo obligatorio').not().isEmpty(),
    check('nutrición', 'Campo obligatorio').not().isEmpty(),    
    validarCampos
], crearMascota);
/*--ruta para actualizar un veterinaria--*/
router.put('/:id', [
    validarJWT,
    check('puntaje', 'Campo obligatorio').not().isEmpty(),
    validarCampos
], actualizarMascota);
/*--ruta para eliminar un vaterinaria--*/
router.delete('/:id', validarJWT, borrarMascota);

module.exports = router;
