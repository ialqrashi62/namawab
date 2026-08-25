const router = require('express').Router();
router.post('/t302_e1_record', require('./tier302_v5_1451_engine.js').record);
router.post('/t302_e2_fetch', require('./tier302_v5_1451_engine.js').fetch);
router.post('/t302_e3_update', require('./tier302_v5_1451_engine.js').update);
router.post('/t302_e4_delete', require('./tier302_v5_1451_engine.js').delete);
router.post('/t302_e5_list', require('./tier302_v5_1451_engine.js').list);
module.exports = router;
