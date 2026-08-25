const router = require('express').Router();
router.post('/t309_e1_record', require('./tier309_ac2_1483_engine.js').record);
router.post('/t309_e2_fetch', require('./tier309_ac2_1483_engine.js').fetch);
router.post('/t309_e3_update', require('./tier309_ac2_1483_engine.js').update);
router.post('/t309_e4_delete', require('./tier309_ac2_1483_engine.js').delete);
router.post('/t309_e5_list', require('./tier309_ac2_1483_engine.js').list);
module.exports = router;
