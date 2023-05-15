// ruta: api/upload/usuarios/:id
const { Router } = require('express');
const expressfileUpload = require('express-fileupload'); // para este primero debe estar instalado el paquete 
const {
    fileUpLoad,
    retornarImagen
} = require('../controllers/uploads');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();

// default options
router.use(expressfileUpload());


router.put('/:tipo/:id', validarJWT, fileUpLoad);
router.get('/:tipo/:foto', retornarImagen);

module.exports = router;