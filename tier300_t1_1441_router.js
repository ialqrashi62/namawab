const router = require('express').Router();
  router.post('/t300_e1_record', require('./tier300_t1_1441_engine.js').record);
  router.post('/t300_e2_fetch', require('./tier300_t1_1441_engine.js').fetch);
  router.post('/t300_e3_update', require('./tier300_t1_1441_engine.js').update);
  router.post('/t300_e4_delete', require('./tier300_t1_1441_engine.js').delete);
  router.post('/t300_e5_list', require('./tier300_t1_1441_engine.js').list);
module.exports = router;
