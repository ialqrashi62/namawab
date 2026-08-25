const router = require('express').Router();
  router.post('/t291_e1_record', require('./tier291_k3_1398_engine.js').record);
  router.post('/t291_e2_fetch', require('./tier291_k3_1398_engine.js').fetch);
  router.post('/t291_e3_update', require('./tier291_k3_1398_engine.js').update);
  router.post('/t291_e4_delete', require('./tier291_k3_1398_engine.js').delete);
  router.post('/t291_e5_list', require('./tier291_k3_1398_engine.js').list);
module.exports = router;
