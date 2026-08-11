---
name: nm-test-suite-default
description: Use when writing any test file. Loads the canonical test fixtures (tenant, patient, user) + assertion patterns so every test follows the same shape. Saves ~70% tokens per test file.
---

# Test Suite Default — Token-Saver for Test Files

## Required test types per feature

| Type | Tooling | Count target |
|---|---|---|
| Unit | node:test or mocha + chai | ≥ 5 per engine |
| Integration | node:test + supertest + DB | ≥ 3 per router |
| RBAC | supertest with role matrix | ≥ 1 per route |
| Tenant isolation | cross-tenant SQL probe | ≥ 1 per DB table |
| Idempotency | repeat-POST probe | ≥ 1 per money/claim route |

## Canonical fixture setup

```js
// namaweb/{dept}_test.js
'use strict';

const { test, before, after } = require('node:test');
const assert  = require('node:assert/strict');
const bcrypt  = require('bcryptjs');
const supertest = require('supertest');
const db = require('./db_postgres');
const app = require('./server');

let tokenDoctor, tokenNurse, tokenPatient;
let testPatientId;

before(async () => {
    // 1. Create test tenant (id=1 already exists on live)
    // 2. Create test users
    const hash = await bcrypt.hash('test', 8);
    await db.query(`INSERT INTO system_users (tenant_id, username, password_hash, role)
        VALUES (1, 't_doc', $1, 'doctor') ON CONFLICT DO NOTHING`, [hash]);
    await db.query(`INSERT INTO system_users (tenant_id, username, password_hash, role)
        VALUES (1, 't_nurse', $1, 'nurse') ON CONFLICT DO NOTHING`, [hash]);
    await db.query(`INSERT INTO system_users (tenant_id, username, password_hash, role)
        VALUES (1, 't_patient', $1, 'patient') ON CONFLICT DO NOTHING`, [hash]);

    // 3. Create test patient
    const { rows } = await db.query(`INSERT INTO patients (tenant_id, mrn, name)
        VALUES (1, 'T-PAT', 'Test Patient') RETURNING id`);
    testPatientId = rows[0].id;

    // 4. Login as each role
    tokenDoctor  = await login('t_doc', 'test');
    tokenNurse   = await login('t_nurse', 'test');
    tokenPatient = await login('t_patient', 'test');
});

after(async () => {
    // Cleanup (idempotent)
    await db.query(`DELETE FROM {dept}_{table} WHERE patient_id = $1`, [testPatientId]);
    await db.query(`DELETE FROM patients WHERE id = $1`, [testPatientId]);
    await db.query(`DELETE FROM system_users WHERE username IN ('t_doc','t_nurse','t_patient')`);
});

async function login(username, password) {
    const r = await supertest(app).post('/api/auth/login')
        .send({ username, password });
    return r.body.token;
}
```

## Unit test (engine)

```js
test('fooScore: low risk patient returns low', () => {
    const out = engine.fooScore({ age: 50, sbp: 130, hr: 75, killip: 1, creatinine: 1.0 });
    assert.equal(out.score, 95);
    assert.equal(out.risk, 'low');
    assert.match(out.recommendation, /refer/i);
    assert.match(out.cite, /PMID/i);
});

test('fooScore: rejects missing age', () => {
    assert.throws(() => engine.fooScore({ sbp: 130, hr: 75, killip: 1, creatinine: 1.0 }), /age/i);
});
```

## Integration test (router)

```js
test('POST /{dept}/{resource}: doctor can create assessment', async () => {
    const r = await supertest(app)
        .post(`/api/{dept}/{resource}`)
        .set('Authorization', `Bearer ${tokenDoctor}`)
        .send({ patient_id: testPatientId, age: 65, sbp: 140, hr: 90, killip: 1, creatinine: 1.0 });
    assert.equal(r.status, 201);
    assert.equal(r.body.risk, 'moderate');
    assert.ok(r.body.id);
});
```

## RBAC test

```js
test('POST /{dept}/{resource}: nurse is forbidden', async () => {
    const r = await supertest(app)
        .post(`/api/{dept}/{resource}`)
        .set('Authorization', `Bearer ${tokenNurse}`)
        .send({ patient_id: testPatientId, age: 65 });
    assert.equal(r.status, 403);
});
```

## Tenant isolation test

```js
test('cross-tenant: doctor in tenant 1 cannot read tenant 2 patient', async () => {
    // Create tenant 2 + patient
    await db.query(`INSERT INTO tenants (id, name) VALUES (2, 'Other') ON CONFLICT DO NOTHING`);
    const { rows } = await db.query(`INSERT INTO patients (tenant_id, mrn, name)
        VALUES (2, 'OTHER-PAT', 'Other') RETURNING id`);
    const otherId = rows[0].id;

    // Doctor from tenant 1 tries to read
    const r = await supertest(app)
        .get(`/api/{dept}/{resource}?patient_id=${otherId}`)
        .set('Authorization', `Bearer ${tokenDoctor}`);
    assert.equal(r.status, 404);  // RLS hides it
});
```

## Idempotency test

```js
test('POST /{dept}/{resource}: idempotency key dedupes', async () => {
    const key = 'test-key-' + Date.now();
    const body = { patient_id: testPatientId, age: 65, sbp: 140, hr: 90, killip: 1, creatinine: 1.0 };
    const r1 = await supertest(app).post(`/api/{dept}/{resource}`)
        .set('Authorization', `Bearer ${tokenDoctor}`)
        .set('Idempotency-Key', key).send(body);
    const r2 = await supertest(app).post(`/api/{dept}/{resource}`)
        .set('Authorization', `Bearer ${tokenDoctor}`)
        .set('Idempotency-Key', key).send(body);
    assert.equal(r1.status, 201);
    assert.equal(r2.status, 200);     // cached
    assert.equal(r1.body.id, r2.body.id);
});
```

## Anti-patterns

- ❌ Skipping tenant isolation test (RAIL-5)
- ❌ Skipping RBAC test (RAIL-13)
- ❌ Skipping idempotency test on money/claim routes (RAIL-6)
- ❌ Hard-coding test patient IDs that may collide across runs
- ❌ Not cleaning up fixtures (test pollution)

## Token saving

Each test file = ~200 lines boilerplate from scratch → ~50 lines with this template.
~70% reduction × 283 test files = ~30K lines saved.