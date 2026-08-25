const router = require('express').Router();
  router.post('/t294_e1_record', require('./tier294_n4_1414_engine.js').record);
  router.post('/t294_e2_fetch', require('./tier294_n4_1414_engine.js').fetch);
  router.post('/t294_e3_update', require('./tier294_n4_1414_engine.js').update);
  router.post('/t294_e4_delete', require('./tier294_n4_1414_engine.js').delete);
  router.post('/t294_e5_list', require('./tier294_n4_1414_engine.js').list);
module.exports = router;
