const express = require('express');
const router = express.Router();
const materiaController = require('../controllers/matPrimaController');
const auth = require('../middlewares/auth');

router.use(auth);

router.get('/', auth, materiaController.obtenerMateria);
router.get('/:id', auth, materiaController.obtenerMateriaPorId);
router.post('/', auth, materiaController.crearMateria);     
router.put('/:id', auth, materiaController.actualizarMateria);
router.delete('/:id', auth, materiaController.eliminarMateria); 

module.exports = router;