const router = require('express').Router();
const { 
    collectFee, 
    generateFees, 
    getStudentFees, 
    getPendingFees 
} = require('../controllers/finance/fee-controller');
const { verifyAdmin } = require('../middleware/auth');

router.post('/collect-fee', verifyAdmin, collectFee);
router.post('/generate-fees', verifyAdmin, generateFees);
router.get('/student/:studentId', verifyAdmin, getStudentFees);
router.get('/pending', verifyAdmin, getPendingFees);

module.exports = router;
