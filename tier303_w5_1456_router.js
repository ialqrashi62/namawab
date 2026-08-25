const router = require('express').Router();
router.post('/t303_e1_record', require('./tier303_w5_1456_engine.js').record);
router.post('/t303_e2_fetch', require('./tier303_w5_1456_engine.js').fetch);
router.post('/t303_e3_update', require('./tier303_w5_1456_engine.js').update);
router.post('/t303_e4_delete', require('./tier303_w5_1456_engine.js').delete);
router.post('/t303_e5_list', require('./tier303_w5_1456_engine.js').list);
module.exports = router;
