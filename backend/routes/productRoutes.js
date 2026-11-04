const express = require('express');
const productController = require('../controllers/productController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// every product route needs a logged in user
router.use(authMiddleware);

// get /api/products?search=
router.get('/', productController.list);

// post /api/products
router.post('/', productController.create);

// get /api/products/:id
router.get('/:id', productController.getOne);

// put /api/products/:id
router.put('/:id', productController.update);

// delete /api/products/:id
router.delete('/:id', productController.remove);

module.exports = router;
