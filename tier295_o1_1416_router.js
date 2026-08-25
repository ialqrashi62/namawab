const router = require('express').Router();
  router.post('/t295_e1_record', require('./tier295_o1_1416_engine.js').record);
  router.post('/t295_e2_fetch', require('./tier295_o1_1416_engine.js').fetch);
  router.post('/t295_e3_update', require('./tier295_o1_1416_engine.js').update);
  router.post('/t295_e4_delete', require('./tier295_o1_1416_engine.js').delete);
  router.post('/t295_e5_list', require('./tier295_o1_1416_engine.js').list);
module.exports = router;
