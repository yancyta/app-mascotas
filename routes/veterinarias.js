/* ruta:   /api/veterinarias   */
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const {
    getVeterinarias,
    crearVeterinaria,
    actualizarVeterinaria,
    borrarVeterinaria
} = require('../controllers/veterinarias');

const router = Router();
/*--ruta para obtener  vaterinarias--*/
router.get('/', getVeterinarias);

/*--ruta para agregar una veterinaria--*/
router.post('/', [
    validarJWT, check('nombre', 'El nombre de la Veterinaria es necesaria').not().isEmpty(),
    validarCampos
], crearVeterinaria);
/*--ruta para actualizar un veterinaria--*/
router.put('/:id', [
    validarJWT, check('nombre', 'El nombre de la Veterinaria es necesaria').not().isEmpty(),
    validarCampos
], actualizarVeterinaria);
/*--ruta para eliminar un vaterinaria--*/
router.delete('/:id', validarJWT, borrarVeterinaria);

module.exports = router;