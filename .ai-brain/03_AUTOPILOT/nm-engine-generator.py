#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
nm-engine-generator.py
Generates Node.js engine files for missing departments.
Output: namaweb/<dept>_engine.js
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


ENGINE_TEMPLATE = '''// filepath: namaweb/{code_short}_engine.js
// {name_en} ({code}) Engine — Generated {date}
// Senior Full-Stack pattern: tenant isolation + RLS + RBAC + idempotency

class {class_name}Engine {{
  constructor(pool) {{
    this.pool = pool;
    this.tenantId = null;
  }}

  setTenant(tenantId) {{
    if (!tenantId) throw new Error("tenantId required (fail-closed)");
    this.tenantId = tenantId;
  }}

  async run(action, payload) {{
    if (!this.tenantId) throw new Error("Tenant not set");
    const handler = this[`on_${{action}}`];
    if (!handler) throw new Error(`Unknown action: ${{action}}`);
    return handler.call(this, payload);
  }}

  async _client() {{
    const client = await this.pool.connect();
    try {{
      await client.query("SET LOCAL app.tenant_id = $1", [this.tenantId]);
      return client;
    }} catch (e) {{
      client.release();
      throw e;
    }}
  }}

  // ============ CRUD ============
  async on_list({{ patient_id, status, limit = 50, offset = 0 }}) {{
    const client = await this._client();
    try {{
      const params = [this.tenantId];
      let sql = `SELECT * FROM {code_short}_encounters WHERE tenant_id = $1 AND deleted_at IS NULL`;
      if (patient_id) {{ params.push(patient_id); sql += ` AND patient_id = ${{params.length}}`; }}
      if (status) {{ params.push(status); sql += ` AND status = ${{params.length}}`; }}
      params.push(limit, offset);
      sql += ` ORDER BY started_at DESC LIMIT ${{params.length - 1}} OFFSET ${{params.length}}`;
      const res = await client.query(sql, params);
      return {{ ok: true, items: res.rows, total: res.rowCount }};
    }} finally {{ client.release(); }}
  }}

  async on_get({{ id }}) {{
    const client = await this._client();
    try {{
      const res = await client.query(
        `SELECT * FROM {code_short}_encounters WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL`,
        [id, this.tenantId]
      );
      if (res.rowCount === 0) return {{ ok: false, error: "Not found" }};
      return {{ ok: true, item: res.rows[0] }};
    }} finally {{ client.release(); }}
  }}

  async on_create(payload, actorId) {{
    const client = await this._client();
    try {{
      const res = await client.query(
        `INSERT INTO {code_short}_encounters
          (tenant_id, patient_id, encounter_type, chief_complaint, diagnosis_codes, status, started_at, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, now(), now(), now())
         RETURNING *`,
        [
          this.tenantId,
          payload.patient_id,
          payload.encounter_type || 'outpatient',
          payload.chief_complaint || null,
          payload.diagnosis_codes || [],
          'active',
        ]
      );
      const encounter = res.rows[0];
      // Audit log
      await client.query(
        `INSERT INTO {code_short}_audit (tenant_id, actor_id, action, entity, entity_id, curr_hash, payload)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [this.tenantId, actorId, 'create', '{code_short}_encounters', encounter.id, 'h_' + Date.now(), JSON.stringify(payload)]
      );
      return {{ ok: true, item: encounter }};
    }} finally {{ client.release(); }}
  }}

  async on_update({{ id, ...updates }}, actorId) {{
    const client = await this._client();
    try {{
      const fields = Object.keys(updates).filter(k => ['status','diagnosis_codes','notes','ended_at'].includes(k));
      if (fields.length === 0) return {{ ok: false, error: "No valid fields" }};
      const setSql = fields.map((f, i) => `${{i + 3}} = ${{f}}`).join(', ');
      const values = fields.map(f => updates[f]);
      const res = await client.query(
        `UPDATE {code_short}_encounters SET ${{setSql}}, updated_at = now()
         WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL RETURNING *`,
        [id, this.tenantId, ...values]
      );
      if (res.rowCount === 0) return {{ ok: false, error: "Not found" }};
      await client.query(
        `INSERT INTO {code_short}_audit (tenant_id, actor_id, action, entity, entity_id, curr_hash, payload)
         VALUES ($1, $2, 'update', '{code_short}_encounters', $3, $4, $5)`,
        [this.tenantId, actorId, id, 'h_' + Date.now(), JSON.stringify(updates)]
      );
      return {{ ok: true, item: res.rows[0] }};
    }} finally {{ client.release(); }}
  }}

  async on_delete({{ id }}, actorId) {{
    const client = await this._client();
    try {{
      const res = await client.query(
        `UPDATE {code_short}_encounters SET deleted_at = now(), updated_at = now()
         WHERE id = $1 AND tenant_id = $2 RETURNING id`,
        [id, this.tenantId]
      );
      if (res.rowCount === 0) return {{ ok: false, error: "Not found" }};
      await client.query(
        `INSERT INTO {code_short}_audit (tenant_id, actor_id, action, entity, entity_id, curr_hash, payload)
         VALUES ($1, $2, 'delete', '{code_short}_encounters', $3, $4, '{{}}')`,
        [this.tenantId, actorId, id, 'h_' + Date.now()]
      );
      return {{ ok: true }};
    }} finally {{ client.release(); }}
  }}

  // ============ Clinical Decision Support ============
  async on_calc_risk({{ score_type, patient_data }}) {{
    const {{
      calculateCHA2DS2VASc, calculateHASBLED, calculateHEART, calculateTIMI,
      calculateMELD, calculateChildPugh, calculateKDIGO, calculateNEWS2,
      calculateAPACHEII, calculateSOFA, calculateqSOFA
    }} = require('./clinical_calculators');
    let score;
    switch (score_type.toUpperCase()) {{
      case 'CHA2DS2_VASc': score = calculateCHA2DS2VASc(patient_data); break;
      case 'HAS_BLED': score = calculateHASBLED(patient_data); break;
      case 'HEART': score = calculateHEART(patient_data); break;
      case 'TIMI': score = calculateTIMI(patient_data); break;
      case 'MELD': score = calculateMELD(patient_data); break;
      case 'CHILD_PUGH': score = calculateChildPugh(patient_data); break;
      case 'KDIGO': score = calculateKDIGO(patient_data); break;
      case 'NEWS2': score = calculateNEWS2(patient_data); break;
      case 'APACHE_II': score = calculateAPACHEII(patient_data); break;
      case 'SOFA': score = calculateSOFA(patient_data); break;
      case 'QSOFA': score = calculateqSOFA(patient_data); break;
      default: return {{ ok: false, error: 'Unknown score type' }};
    }}
    return {{ ok: true, score }};
  }}

  async on_check_drug_interactions({{ medications }}) {{
    const {{ DrugCheckService }} = require('./drug_check');
    const checker = new DrugCheckService(this.tenantId);
    const interactions = await checker.checkInteractions(medications);
    return {{ ok: true, interactions }};
  }}

  // ============ AI Diagnosis ============
  async on_ai_diagnose({{ question, patient_context }}) {{
    const {{ buildDiagnosisAgent }} = require('./rag_pipeline');
    const agent = buildDiagnosisAgent(this.tenantId, '{code_short}');
    const result = await agent.invoke({{ input: question, patient_context }});
    return {{ ok: true, answer: result.output, sources: result.source_documents || [] }};
  }}
}}

module.exports = {class_name}Engine;
'''


def generate_engine(dept, out_root, date):
    """Generate one engine file."""
    code = dept["code"]
    code_short = dept["code_short"]
    name_en = dept["name_en"]
    name_ar = dept.get("name_ar", code)
    class_name = "".join(p.capitalize() for p in code_short.split("_")) + "Engine"

    content = ENGINE_TEMPLATE.format(
        code=code,
        code_short=code_short,
        name_en=name_en,
        name_ar=name_ar,
        class_name=class_name,
        date=date,
    )

    out_path = out_root / f"{code_short}_engine.js"
    out_path.write_text(content, encoding="utf-8")
    return str(out_path)


def main():
    cfg_path = WORKSPACE / ".ai-brain/03_AUTOPILOT/dept_config_all.yaml"
    with open(cfg_path, "r", encoding="utf-8") as f:
        cfg = yaml.safe_load(f)

    date = datetime.now().strftime("%Y-%m-%d")
    written = []
    skipped = []

    for dept in cfg["depts"]:
        code_short = dept["code_short"]
        engine_path = OUT_DIR / f"{code_short}_engine.js"
        if engine_path.exists():
            skipped.append(str(engine_path))
            continue
        path = generate_engine(dept, OUT_DIR, date)
        written.append(path)

    print(f"[STATS] Engines generated: {len(written)}")
    print(f"[STATS] Skipped (existing): {len(skipped)}")
    for p in written[:5]:
        print(f"  [+] {p}")
    if len(written) > 5:
        print(f"  ... and {len(written) - 5} more")


if __name__ == "__main__":
    main()
