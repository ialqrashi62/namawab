const router = require('express').Router();
router.post('/t310_e1_record', require('./tier310_ad5_1491_engine.js').record);
router.post('/t310_e2_fetch', require('./tier310_ad5_1491_engine.js').fetch);
router.post('/t310_e3_update', require('./tier310_ad5_1491_engine.js').update);
router.post('/t310_e4_delete', require('./tier310_ad5_1491_engine.js').delete);
router.post('/t310_e5_list', require('./tier310_ad5_1491_engine.js').list);
module.exports = router;
