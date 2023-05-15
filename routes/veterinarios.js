/* ruta:   /api/veterinarios   */
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const {
    getVeterinarios,
    crearVeterinario,
    actualizarVeterinario,
    borrarVeterinario,
    getVeterinarioById
} = require('../controllers/veterinarios');

const router = Router();
/*--ruta para obtener  vaterinarios--*/
router.get('/', validarJWT, getVeterinarios);

/*--ruta para agregar una veterinario--*/
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre del Veterinario es obligatorio').not().isEmpty(),
    check('veterinaria', 'La Veterinaria id, debe ser válido').isMongoId(),
    validarCampos
], crearVeterinario);
/*--ruta para actualizar un veterinario--*/
router.put('/:id', [validarJWT, check('nombre', 'El nombre del  Veterinario es necesario').not().isEmpty(),
    check('veterinaria', 'La Veterinaria id, debe ser válido').isMongoId(),
    validarCampos
], actualizarVeterinario);
/*--ruta para eliminar un vaterinario--*/
router.delete('/:id', validarJWT, borrarVeterinario);
/*** ruta para obtener un veterinarios */
router.get('/:id', validarJWT, getVeterinarioById);

module.exports = router;