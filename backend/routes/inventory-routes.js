const router = require('express').Router();
const { 
    consumeItem, 
    addItem, 
    restockItem, 
    getInventoryList, 
    getLowStock 
} = require('../controllers/inventory-controller');
const { verifyAdmin } = require('../middleware/auth');

router.post('/consume', verifyAdmin, consumeItem);
router.post('/add', verifyAdmin, addItem);
router.put('/restock/:itemId', verifyAdmin, restockItem);
router.get('/list', verifyAdmin, getInventoryList);
router.get('/low-stock', verifyAdmin, getLowStock);

module.exports = router;
