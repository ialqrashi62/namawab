const router = require('express').Router();
router.post('/t306_e1_record', require('./tier306_z2_1468_engine.js').record);
router.post('/t306_e2_fetch', require('./tier306_z2_1468_engine.js').fetch);
router.post('/t306_e3_update', require('./tier306_z2_1468_engine.js').update);
router.post('/t306_e4_delete', require('./tier306_z2_1468_engine.js').delete);
router.post('/t306_e5_list', require('./tier306_z2_1468_engine.js').list);
module.exports = router;
