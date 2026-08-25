const router = require('express').Router();
  router.post('/t293_e1_record', require('./tier293_m4_1409_engine.js').record);
  router.post('/t293_e2_fetch', require('./tier293_m4_1409_engine.js').fetch);
  router.post('/t293_e3_update', require('./tier293_m4_1409_engine.js').update);
  router.post('/t293_e4_delete', require('./tier293_m4_1409_engine.js').delete);
  router.post('/t293_e5_list', require('./tier293_m4_1409_engine.js').list);
module.exports = router;
