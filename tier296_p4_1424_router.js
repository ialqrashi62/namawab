const router = require('express').Router();
  router.post('/t296_e1_record', require('./tier296_p4_1424_engine.js').record);
  router.post('/t296_e2_fetch', require('./tier296_p4_1424_engine.js').fetch);
  router.post('/t296_e3_update', require('./tier296_p4_1424_engine.js').update);
  router.post('/t296_e4_delete', require('./tier296_p4_1424_engine.js').delete);
  router.post('/t296_e5_list', require('./tier296_p4_1424_engine.js').list);
module.exports = router;
