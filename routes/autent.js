const { Router } = require('express');
const { login, googleSignIn, renewToken } = require('../controllers/autent');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const {forgotPassword }= require('../controllers/recuperarPassw');
const router = Router();
// path:'/api/login'
/*-- ruta para el login --*/
router.post('/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos,
], login);

router.post('/google', [
    check('token', 'El token es obligatorio ').not().isEmpty(),
    validarCampos,
], googleSignIn);

router.get('/renew', validarJWT, renewToken);
// forgot password
router.put('/forgot-pass',forgotPassword);
// nuevo password
//router.put('/new-pass',createNewPassw);

module.exports = router;