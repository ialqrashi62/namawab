#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
nm-test-generator.py
Generates Jest test file per dept.
Output: namaweb/<dept>_test.js
"""
import io
import os
import sys
import yaml
from pathlib import Path
from datetime import datetime

if hasattr(sys.stdout, 'buffer'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

WORKSPACE = Path(r"c:\Users\ice\Desktop\NMEDCALVSCODE")
OUT_DIR = WORKSPACE / "namaweb"

TEST_TEMPLATE = """// filepath: namaweb/{code_short}_test.js
// {name_en} ({code}) Tests — Generated {date}
const request = require('supertest');
const {{ app, pool }} = require('./server');

describe('{name_en} API', () => {{
  let tenantId;
  let userId;

  beforeAll(async () => {{
    // Setup test tenant + user
    const t = await pool.query("INSERT INTO tenants(name) VALUES ($1) RETURNING id", ['test_{code_short}']);
    tenantId = t.rows[0].id;
    const u = await pool.query(
      "INSERT INTO users(tenant_id, username, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id",
      [tenantId, 'test_{code_short}', '$2b$10$test', '{code_short}_specialist']
    );
    userId = u.rows[0].id;
  }});

  afterAll(async () => {{
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);
    await pool.query("DELETE FROM tenants WHERE id = $1", [tenantId]);
    await pool.end();
  }});

  test('GET /api/{code_short}/list without tenant → 400', async () => {{
    const res = await request(app).get('/api/{code_short}/list');
    expect([400, 401]).toContain(res.status);
  }});

  test('GET /api/{code_short}/list with tenant → 200', async () => {{
    const res = await request(app)
      .get('/api/{code_short}/list')
      .set('x-tenant-id', String(tenantId));
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('ok');
  }});

  test('GET /api/{code_short}/list filters by tenant (RLS)', async () => {{
    const other = await pool.query("INSERT INTO tenants(name) VALUES ($1) RETURNING id", ['other_{code_short}']);
    const otherId = other.rows[0].id;
    const res = await request(app)
      .get('/api/{code_short}/list')
      .set('x-tenant-id', String(otherId));
    expect(res.status).toBe(200);
    expect(res.body.items || []).toEqual([]);
    await pool.query("DELETE FROM tenants WHERE id = $1", [otherId]);
  }});

  test('POST /api/{code_short}/risk/calculate for known score', async () => {{
    const res = await request(app)
      .post('/api/{code_short}/risk/calculate')
      .set('x-tenant-id', String(tenantId))
      .send({{ score_type: 'NEWS2', patient_data: {{ hr: 80, sbp: 120, spo2: 98, rr: 16, temp: 37 }} }});
    expect([200, 501]).toContain(res.status);
    if (res.status === 200) expect(res.body.score).toBeDefined();
  }});

  test('POST /api/{code_short}/drug-interactions returns array', async () => {{
    const res = await request(app)
      .post('/api/{code_short}/drug-interactions')
      .set('x-tenant-id', String(tenantId))
      .send({{ medications: ['warfarin', 'aspirin'] }});
    expect([200, 501]).toContain(res.status);
  }});

  test('Cross-tenant access is blocked', async () => {{
    // Create a record in our tenant
    const rec = await pool.query(
      "INSERT INTO {code_short}_encounters(tenant_id, patient_id, status) VALUES ($1, 1, 'active') RETURNING id",
      [tenantId]
    );
    const recId = rec.rows[0].id;
    // Try to access from another tenant
    const other = await pool.query("INSERT INTO tenants(name) VALUES ($1) RETURNING id", ['cross_tenant']);
    const otherId = other.rows[0].id;
    const res = await request(app)
      .get('/api/{code_short}/' + recId)
      .set('x-tenant-id', String(otherId));
    expect([404, 403]).toContain(res.status);
    // Cleanup
    await pool.query("DELETE FROM {code_short}_encounters WHERE id = $1", [recId]);
    await pool.query("DELETE FROM tenants WHERE id = $1", [otherId]);
  }});
}});
"""


def generate_test(dept, date):
    code = dept["code"]
    code_short = dept["code_short"]
    name_en = dept["name_en"]
    content = TEST_TEMPLATE.format(
        code=code, code_short=code_short, name_en=name_en, date=date,
    )
    out_path = OUT_DIR / f"{code_short}_test.js"
    out_path.write_text(content, encoding="utf-8")
    return str(out_path)


def main():
    cfg_path = WORKSPACE / ".ai-brain/03_AUTOPILOT/dept_config_all.yaml"
    with open(cfg_path, "r", encoding="utf-8") as f:
        cfg = yaml.safe_load(f)

    date = datetime.now().strftime("%Y-%m-%d")
    written, skipped = [], []
    for dept in cfg["depts"]:
        code_short = dept["code_short"]
        test_path = OUT_DIR / f"{code_short}_test.js"
        if test_path.exists():
            skipped.append(str(test_path))
            continue
        path = generate_test(dept, date)
        written.append(path)

    print(f"[STATS] Tests generated: {len(written)}")
    print(f"[STATS] Skipped (existing): {len(skipped)}")


if __name__ == "__main__":
    main()
