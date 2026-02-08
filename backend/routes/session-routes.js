const router = require('express').Router();
const { 
    initializeSession, 
    getActiveSession, 
    activateSession, 
    listSessions 
} = require('../controllers/session-controller');
const { verifyAdmin } = require('../middleware/auth');

router.post('/create', verifyAdmin, initializeSession);
router.get('/active', verifyAdmin, getActiveSession);
router.put('/activate/:sessionId', verifyAdmin, activateSession);
router.get('/list', verifyAdmin, listSessions);

module.exports = router;
