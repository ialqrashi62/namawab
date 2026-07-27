// pcc_pediatric_surg_ext13 integration test v3.123.0
const request = require('supertest');
const express = require('express');
const router = require('./pcc_pediatric_surg_ext13_routes');
const app = express();
app.use(express.json());
app.use('/', router);
const assert = require('assert');

(async () => {
  let passed = 0;
  let res = await request(app).get('/list');
  assert.strictEqual(res.status, 200); passed++;
  assert.strictEqual(res.body.version, '3.123.0'); passed++;
  for (const fn of ['PediatricTraumaSurgery', 'PediatricSplenectomyTrauma', 'PediatricLiverLaceration', 'PediatricKidneyLaceration', 'PediatricBowelInjury', 'PediatricPancreaticInjury', 'PediatricVascularInjury', 'PediatricThoracicTrauma', 'PediatricHeadTrauma', 'PediatricSpinalTrauma']) {
    res = await request(app).post('/call/' + fn).send({t:'yes'});
    assert.strictEqual(res.status, 200); passed++;
    res = await request(app).post('/record').send({tenant_id:'t1',fn,input:{a:1}});
    assert.strictEqual(res.status, 200); passed++;
  }
  console.log('pcc_pediatric_surg_ext13 integration:', passed, 'passed');
})();
