const router = require('express').Router();
router.post('/t305_e1_record', require('./tier305_y5_1466_engine.js').record);
router.post('/t305_e2_fetch', require('./tier305_y5_1466_engine.js').fetch);
router.post('/t305_e3_update', require('./tier305_y5_1466_engine.js').update);
router.post('/t305_e4_delete', require('./tier305_y5_1466_engine.js').delete);
router.post('/t305_e5_list', require('./tier305_y5_1466_engine.js').list);
module.exports = router;
