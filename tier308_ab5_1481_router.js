const router = require('express').Router();
router.post('/t308_e1_record', require('./tier308_ab5_1481_engine.js').record);
router.post('/t308_e2_fetch', require('./tier308_ab5_1481_engine.js').fetch);
router.post('/t308_e3_update', require('./tier308_ab5_1481_engine.js').update);
router.post('/t308_e4_delete', require('./tier308_ab5_1481_engine.js').delete);
router.post('/t308_e5_list', require('./tier308_ab5_1481_engine.js').list);
module.exports = router;
