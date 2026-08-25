const router = require('express').Router();
router.post('/t304_e1_record', require('./tier304_x2_1458_engine.js').record);
router.post('/t304_e2_fetch', require('./tier304_x2_1458_engine.js').fetch);
router.post('/t304_e3_update', require('./tier304_x2_1458_engine.js').update);
router.post('/t304_e4_delete', require('./tier304_x2_1458_engine.js').delete);
router.post('/t304_e5_list', require('./tier304_x2_1458_engine.js').list);
module.exports = router;
