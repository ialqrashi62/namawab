const router = require('express').Router();
router.post('/t301_e1_record', require('./tier301_u5_1446_engine.js').record);
router.post('/t301_e2_fetch', require('./tier301_u5_1446_engine.js').fetch);
router.post('/t301_e3_update', require('./tier301_u5_1446_engine.js').update);
router.post('/t301_e4_delete', require('./tier301_u5_1446_engine.js').delete);
router.post('/t301_e5_list', require('./tier301_u5_1446_engine.js').list);
module.exports = router;
