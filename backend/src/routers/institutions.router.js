const express = require('express')
const router = express.Router()

// ? Desc:    Load Controllers
const InstitutionsController = require('../controllers/institutions.controller')

router.get('/', InstitutionsController.index);
router.post('/', InstitutionsController.create);
router.get('/:id', InstitutionsController.show);
router.put('/:id', InstitutionsController.update);
router.delete('/:id', InstitutionsController.delete);

module.exports = router