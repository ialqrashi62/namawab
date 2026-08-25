const router = require('express').Router();
router.post('/t307_e1_record', require('./tier307_aa4_1475_engine.js').record);
router.post('/t307_e2_fetch', require('./tier307_aa4_1475_engine.js').fetch);
router.post('/t307_e3_update', require('./tier307_aa4_1475_engine.js').update);
router.post('/t307_e4_delete', require('./tier307_aa4_1475_engine.js').delete);
router.post('/t307_e5_list', require('./tier307_aa4_1475_engine.js').list);
module.exports = router;
