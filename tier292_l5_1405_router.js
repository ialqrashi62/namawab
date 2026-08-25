const router = require('express').Router();
  router.post('/t292_e1_record', require('./tier292_l5_1405_engine.js').record);
  router.post('/t292_e2_fetch', require('./tier292_l5_1405_engine.js').fetch);
  router.post('/t292_e3_update', require('./tier292_l5_1405_engine.js').update);
  router.post('/t292_e4_delete', require('./tier292_l5_1405_engine.js').delete);
  router.post('/t292_e5_list', require('./tier292_l5_1405_engine.js').list);
module.exports = router;
