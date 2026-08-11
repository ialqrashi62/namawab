#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
nm-route-generator.py
Generates Express router file per dept + appends to server.js (if not present).
Output: namaweb/<dept>_router.js
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

ROUTER_TEMPLATE = """// filepath: namaweb/{code_short}_router.js
// {name_en} ({code}) Router — Generated {date}

const express = require('express');
const router = express.Router();
const {{ requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard }} = require('./middleware');
const {{ {class_name} }} = require('./{code_short}_engine');

// Factory: each request gets a fresh engine with tenant from header
const engineFactory = (pool) => (req, res, next) => {{
  req.engine = new {class_name}(pool);
  req.engine.setTenant(req.tenantId);
  next();
}};

module.exports = (pool, routeSchemas) => {{
  const factory = engineFactory(pool);

  // List encounters
  router.get('/list',
    requireAuth,
    requireTenantScope,
    requireRole(['{code_short}_specialist', '{code_short}_nurse', 'admin', 'doctor']),
    factory,
    async (req, res) => {{
      try {{
        const {{ patient_id, status, limit = 50, offset = 0 }} = req.query;
        const result = await req.engine.run('list', {{
          patient_id: patient_id ? parseInt(patient_id, 10) : undefined,
          status,
          limit: parseInt(limit, 10),
          offset: parseInt(offset, 10),
        }});
        res.json(result);
      }} catch (e) {{
        res.status(500).json({{ ok: false, error: e.message }});
      }}
    }}
  );

  // Get one encounter
  router.get('/:id(\\d+)',
    requireAuth,
    requireTenantScope,
    factory,
    async (req, res) => {{
      try {{
        const result = await req.engine.run('get', {{ id: parseInt(req.params.id, 10) }});
        if (!result.ok) return res.status(404).json(result);
        res.json(result);
      }} catch (e) {{
        res.status(500).json({{ ok: false, error: e.message }});
      }}
    }}
  );

  // Create encounter
  router.post('/',
    requireAuth,
    requireTenantScope,
    requireRole(['{code_short}_specialist', '{code_short}_nurse', 'admin']),
    validateBody(routeSchemas.{code_short}_create),
    factory,
    async (req, res) => {{
      try {{
        const result = await req.engine.on_create(req.body, req.user.id);
        res.status(201).json(result);
      }} catch (e) {{
        res.status(500).json({{ ok: false, error: e.message }});
      }}
    }}
  );

  // Update encounter
  router.put('/:id(\\d+)',
    requireAuth,
    requireTenantScope,
    requireRole(['{code_short}_specialist', 'admin']),
    factory,
    async (req, res) => {{
      try {{
        const result = await req.engine.run('update', {{ id: parseInt(req.params.id, 10), ...req.body }}, req.user.id);
        if (!result.ok) return res.status(404).json(result);
        res.json(result);
      }} catch (e) {{
        res.status(500).json({{ ok: false, error: e.message }});
      }}
    }}
  );

  // Soft delete
  router.delete('/:id(\\d+)',
    requireAuth,
    requireTenantScope,
    requireRole(['{code_short}_specialist', 'admin']),
    factory,
    async (req, res) => {{
      try {{
        const result = await req.engine.run('delete', {{ id: parseInt(req.params.id, 10) }}, req.user.id);
        if (!result.ok) return res.status(404).json(result);
        res.status(204).end();
      }} catch (e) {{
        res.status(500).json({{ ok: false, error: e.message }});
      }}
    }}
  );

  // Risk score calculator
  router.post('/risk/calculate',
    requireAuth,
    requireTenantScope,
    factory,
    async (req, res) => {{
      try {{
        const result = await req.engine.run('calc_risk', req.body);
        res.json(result);
      }} catch (e) {{
        res.status(500).json({{ ok: false, error: e.message }});
      }}
    }}
  );

  // Drug interaction check
  router.post('/drug-interactions',
    requireAuth,
    requireTenantScope,
    factory,
    async (req, res) => {{
      try {{
        const result = await req.engine.run('check_drug_interactions', {{ medications: req.body.medications || [] }});
        res.json(result);
      }} catch (e) {{
        res.status(500).json({{ ok: false, error: e.message }});
      }}
    }}
  );

  // AI diagnose
  router.post('/ai/diagnose',
    requireAuth,
    requireTenantScope,
    requireRole(['{code_short}_specialist', 'doctor', 'admin']),
    factory,
    async (req, res) => {{
      try {{
        const result = await req.engine.run('ai_diagnose', {{
          question: req.body.question || '',
          patient_context: req.body.patient_context || {{}},
        }});
        res.json(result);
      }} catch (e) {{
        res.status(500).json({{ ok: false, error: e.message }});
      }}
    }}
  );

  // Orders sub-route
  router.get('/orders',
    requireAuth,
    requireTenantScope,
    factory,
    async (req, res) => {{
      try {{
        const {{ patient_id }} = req.query;
        const result = await req.engine.run('list', {{
          patient_id: patient_id ? parseInt(patient_id, 10) : undefined,
          status: 'pending',
        }});
        res.json(result);
      }} catch (e) {{
        res.status(500).json({{ ok: false, error: e.message }});
      }}
    }}
  );

  // Results sub-route
  router.get('/results',
    requireAuth,
    requireTenantScope,
    factory,
    async (req, res) => {{
      try {{
        const {{ patient_id }} = req.query;
        const result = await req.engine.run('list', {{
          patient_id: patient_id ? parseInt(patient_id, 10) : undefined,
          status: 'completed',
        }});
        res.json(result);
      }} catch (e) {{
        res.status(500).json({{ ok: false, error: e.message }});
      }}
    }}
  );

  // Notes sub-route
  router.post('/notes',
    requireAuth,
    requireTenantScope,
    requireRole(['{code_short}_specialist', 'admin']),
    factory,
    async (req, res) => {{
      try {{
        const {{ patient_id, encounter_id, note_text, action }} = req.body;
        const result = await req.engine.on_create(
          {{ patient_id, encounter_id, notes: note_text, status: action === 'signed' ? 'signed' : 'draft' }},
          req.user.id
        );
        res.status(201).json(result);
      }} catch (e) {{
        res.status(500).json({{ ok: false, error: e.message }});
      }}
    }}
  );

  return router;
}};
"""


def generate_router(dept, out_root, date):
    code = dept["code"]
    code_short = dept["code_short"]
    name_en = dept["name_en"]
    class_name = "".join(p.capitalize() for p in code_short.split("_")) + "Engine"

    content = ROUTER_TEMPLATE.format(
        code=code, code_short=code_short, name_en=name_en,
        class_name=class_name, date=date,
    )
    out_path = out_root / f"{code_short}_router.js"
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
        router_path = OUT_DIR / f"{code_short}_router.js"
        if router_path.exists():
            skipped.append(str(router_path))
            continue
        path = generate_router(dept, OUT_DIR, date)
        written.append(path)

    print(f"[STATS] Routers generated: {len(written)}")
    print(f"[STATS] Skipped (existing): {len(skipped)}")


if __name__ == "__main__":
    main()
