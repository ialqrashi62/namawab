// pcc_pediatric_neuro_ext30 integration test v3.140.0
const request = require('supertest');
const express = require('express');
const router = require('./pcc_pediatric_neuro_ext30_routes');
const app = express();
app.use(express.json());
app.use('/', router);
const assert = require('assert');

(async () => {
  let passed = 0;
  let res = await request(app).get('/list');
  assert.strictEqual(res.status, 200); passed++;
  assert.strictEqual(res.body.version, '3.140.0'); passed++;
  for (const fn of ['PediatricSpinalMuscularAtrophyExt', 'PediatricDuchenneMuscularDystrophy', 'PediatricBeckerMuscularDystrophy', 'PediatricMyotonicDystrophyExt', 'PediatricFacioscapulohumeralExt', 'PediatricLimbGirdleExt', 'PediatricCongenitalMyopathyExt', 'PediatricMitochondrialMyopathy', 'PediatricInflammatoryMyopathyExt', 'PediatricDermatomyositisExt']) {
    res = await request(app).post('/call/' + fn).send({t:'yes'});
    assert.strictEqual(res.status, 200); passed++;
    res = await request(app).post('/record').send({tenant_id:'t1',fn,input:{a:1}});
    assert.strictEqual(res.status, 200); passed++;
  }
  console.log('pcc_pediatric_neuro_ext30 integration:', passed, 'passed');
})();
