---
name: nm-testing-qa
description: Use when writing any QA test (unit, integration, BDD, smoke, acceptance). Loads the canonical patterns + tools (node:test, supertest, chai, cucumber). Saves ~75% tokens per QA module.
---

# Testing & QA — Token-Saver

## When to use

Any QA work:
- Unit tests for engines
- Integration tests for routers
- BDD/Acceptance tests for full user flows
- Smoke tests after deploy
- Load/stress tests for performance

## Test pyramid

```
        /\         E2E (Selenium/Playwright) — 5% of suite
       /  \        
      /    \       Integration (supertest + DB) — 25%
     /------\      
    /        \     Unit (node:test + chai) — 70%
   /__________\    
```

## Unit test (node:test)

```js
// test/cardiology_engine_test.js
'use strict';
const { test } = require('node:test');
const assert  = require('node:assert/strict');
const { graceScore, cha2ds2vasc } = require('../cardiology_engine');

test('graceScore: low risk returns low', () => {
    const r = graceScore({ age: 50, sbp: 130, hr: 75, killip: 1, creatinine: 1.0 });
    assert.equal(r.risk, 'low');
    assert.ok(r.score < 100);
    assert.match(r.cite, /PMID/i);
});

test('graceScore: missing age throws', () => {
    assert.throws(() => graceScore({ sbp: 130, hr: 75, killip: 1, creatinine: 1.0 }),
                  /age/i);
});

test('cha2ds2vasc: F 30 years no risk factors', () => {
    const r = cha2ds2vasc({ age: 30, sex: 'F', chf: false, htn: false, dm: false,
                            stroke: false, vascular: false });
    assert.equal(r.score, 1);   // F = 1
    assert.equal(r.risk, 'low');
});
```

## Integration test (supertest + DB)

```js
// test/cardiology_router_test.js
'use strict';
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');
const supertest = require('supertest');
const db = require('../db_postgres');
const app = require('../server');

let doctorToken, nurseToken, testPatientId;

before(async () => {
    const hash = await bcrypt.hash('test123', 8);
    await db.query(`INSERT INTO system_users (tenant_id, username, password_hash, role)
        VALUES (1, 'q_doc', $1, 'doctor') ON CONFLICT DO NOTHING`, [hash]);
    await db.query(`INSERT INTO system_users (tenant_id, username, password_hash, role)
        VALUES (1, 'q_nurse', $1, 'nurse') ON CONFLICT DO NOTHING`, [hash]);
    const { rows } = await db.query(`INSERT INTO patients (tenant_id, mrn, name)
        VALUES (1, 'Q-PAT', 'Q Patient') RETURNING id`);
    testPatientId = rows[0].id;
    doctorToken = await login('q_doc', 'test123');
    nurseToken  = await login('q_nurse', 'test123');
});

after(async () => {
    await db.query('DELETE FROM cardiology_assessments WHERE patient_id = $1', [testPatientId]);
    await db.query('DELETE FROM patients WHERE id = $1', [testPatientId]);
    await db.query("DELETE FROM system_users WHERE username IN ('q_doc','q_nurse')");
});

async function login(u, p) {
    const r = await supertest(app).post('/api/auth/login').send({ username: u, password: p });
    return r.body.token || r.headers['set-cookie'][0];
}

test('POST /api/cardiology/assessments/grace: doctor can create', async () => {
    const r = await supertest(app)
        .post('/api/cardiology/assessments/grace')
        .set('Authorization', `Bearer ${doctorToken}`)
        .send({ patient_id: testPatientId, age: 65, sbp: 140, hr: 90, killip: 1, creatinine: 1.0 });
    assert.equal(r.status, 201);
    assert.match(r.body.risk, /low|moderate|high/);
    assert.ok(r.body.id);
});

test('POST /api/cardiology/assessments/grace: nurse is forbidden', async () => {
    const r = await supertest(app)
        .post('/api/cardiology/assessments/grace')
        .set('Authorization', `Bearer ${nurseToken}`)
        .send({ patient_id: testPatientId, age: 65 });
    assert.equal(r.status, 403);
});

test('cross-tenant isolation: tenant 2 patient is hidden', async () => {
    await db.query('INSERT INTO tenants (id, name) VALUES (2, \'Other\') ON CONFLICT DO NOTHING');
    const { rows } = await db.query(`INSERT INTO patients (tenant_id, mrn, name)
        VALUES (2, 'OTHER-Q', 'Other') RETURNING id`);
    const otherId = rows[0].id;
    const r = await supertest(app)
        .get(`/api/cardiology/assessments/grace?patient_id=${otherId}`)
        .set('Authorization', `Bearer ${doctorToken}`);
    assert.equal(r.status, 404);
});
```

## BDD test (cucumber-js)

```js
// test/features/cardiology.feature
Feature: Cardiology GRACE assessment
  Scenario: Doctor calculates low-risk GRACE
    Given I am logged in as "doctor"
    And a patient with MRN "T-001" exists
    When I POST to "/api/cardiology/assessments/grace" with:
      | age | sbp | hr | killip | creatinine |
      | 50  | 130 | 75 | 1      | 1.0        |
    Then response status is 201
    And response body has risk "low"
    And response body has score less than 100
```

```js
// test/features/step_defs.js
const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('node:assert/strict');
const supertest = require('supertest');
const app = require('../../server');

let token, response, patientId;

Given('I am logged in as {string}', async (role) => {
    const r = await supertest(app).post('/api/auth/login')
        .send({ username: `q_${role}`, password: 'test123' });
    token = r.body.token;
});

Given('a patient with MRN {string} exists', async (mrn) => {
    const { rows } = await db.query(`INSERT INTO patients (tenant_id, mrn, name)
        VALUES (1, $1, 'Test') RETURNING id`, [mrn]);
    patientId = rows[0].id;
});

When('I POST to {string} with:', async (path, table) => {
    const body = {};
    table.raw().forEach(([k, v]) => body[k] = Number(v) || v);
    body.patient_id = patientId;
    response = await supertest(app).post(path)
        .set('Authorization', `Bearer ${token}`).send(body);
});

Then('response status is {int}', (status) => assert.equal(response.status, status));
Then('response body has risk {string}', (risk) => assert.equal(response.body.risk, risk));
Then('response body has score less than {int}', (max) => assert.ok(response.body.score < max));
```

## Smoke test (post-deploy)

```js
// scripts/smoke.js
const supertest = require('supertest');
const baseUrl = process.env.SMOKE_URL || 'http://localhost:3000';

(async () => {
    const checks = [
        { name: 'health',     method: 'get',  path: '/api/health' },
        { name: 'cardiology', method: 'get',  path: '/api/cardiology/health' },
        { name: 'icd10',      method: 'get',  path: '/api/cardiology/icd10' },
        { name: 'oncology',   method: 'get',  path: '/api/oncology/health' },
        { name: 'pediatrics', method: 'get',  path: '/api/pediatrics/health' },
        { name: 'tnm-stages', method: 'get',  path: '/api/oncology/tnm-stages' },
        { name: 'grace-low',  method: 'post', path: '/api/cardiology/assessments/grace',
          body: { age: 50, sbp: 130, hr: 75, killip: 1, creatinine: 1.0 } }
    ];
    let fail = 0;
    for (const c of checks) {
        try {
            const r = await supertest(baseUrl)[c.method](c.path).send(c.body || {});
            const ok = r.status >= 200 && r.status < 500;
            console.log(ok ? '✓' : '✗', c.name, r.status);
            if (!ok) fail++;
        } catch (e) {
            console.log('✗', c.name, e.message);
            fail++;
        }
    }
    process.exit(fail > 0 ? 1 : 0);
})();
```

## Acceptance criteria (definition of done)

For each feature:
- [ ] Unit tests pass (≥ 5)
- [ ] Integration tests pass (≥ 3)
- [ ] RBAC test verifies matrix
- [ ] Tenant isolation test passes
- [ ] Idempotency test passes (if applicable)
- [ ] Smoke test passes against live
- [ ] Coverage ≥ 80%
- [ ] No `console.log` of PHI

## Token saving

Each QA module from scratch = ~250 lines. With template = ~60 lines unique.
~75% reduction.