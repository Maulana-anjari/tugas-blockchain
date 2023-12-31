const express = require('express')
const router = express.Router()

// ? Desc:    Load Controllers
const AssetsController = require('../controllers/assets.controller')

router.get('/', AssetsController.index);
router.post('/', AssetsController.create);
router.get('/:id', AssetsController.show);
router.put('/:id', AssetsController.update);
router.delete('/:id', AssetsController.delete);
router.get('/kategori/:kategori', AssetsController.getInventoryByCategory);

module.exports = router