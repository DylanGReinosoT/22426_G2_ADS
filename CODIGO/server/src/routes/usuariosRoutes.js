const express = require('express');
const router = express.Router();
const usuarioCrontroller = require('../controllers/usuarioController');
const auth = require('../middlewares/auth');

router.use(auth);

router.get('/',auth,usuarioCrontroller.obtenerUsuarios);
router.get('/:id',auth,usuarioCrontroller.obtenerUsuarioPorId);
router.post('/',auth,usuarioCrontroller.crearUsuario);
router.put('/:id',auth,usuarioCrontroller.actualizarUsuario);
router.delete('/:id',auth,usuarioCrontroller.eliminarUsuario);
module.exports = router;