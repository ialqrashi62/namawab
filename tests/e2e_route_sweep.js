// tests/e2e_route_sweep.js â€” E2E regression sweep over auto-mounted tier routers
// Usage: BASE=http://127.0.0.1:3000 node tests/e2e_route_sweep.js [--deep]
// Classifies per module: ALIVE (200/400-validation) | DEAD(404) | ERROR(500) | SKIP(stub/no-engine)
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = __dirname + '/..';
const RX = /^tier(?:17[1-9]|1[89]\d|2\d\d|3\d\d)_\w+_\d+_router\.js$/;
const BASE = process.env.BASE || 'http://127.0.0.1:3000';
const CONC = Number(process.env.CONC || 20);

function allFuncs(routerFile, engineFile) {
  const out = [];
  try {
    const rsrc = fs.readFileSync(path.join(ROOT, routerFile), 'utf8');
    const re = /\.post\(\s*['"]\/([A-Za-z0-9_:.-]+)['"]/g;
    let m; while ((m = re.exec(rsrc))) out.push(m[1]);
    if (out.length) return out;
  } catch {}
  try {
    const src = fs.readFileSync(path.join(ROOT, engineFile), 'utf8');
    const m = src.match(/function\s+funcs\(\)\s*\{\s*return\s*\{([^}]+)\}/);
    if (m) return m[1].split(',').map(s => s.trim().split(/\s/)[0]).filter(Boolean);
  } catch {}
  return [];
}

async function probe(basePath, fn) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 8000);
  try {
    const res = await fetch(`${BASE}${basePath}/${fn}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-tenant-id': 't1', ...(process.env.TIER_API_KEY ? { 'x-api-key': process.env.TIER_API_KEY } : {}) },
      body: JSON.stringify({ tenant_id: 't1', patient_id: 'p1' }),
      signal: ctl.signal,
    });
    clearTimeout(t);
    const text = await res.text().catch(() => '');
    if (res.status === 404 || /Cannot POST/.test(text)) return { s: 'DEAD' };
    if (res.status >= 500) return { s: 'ERROR', detail: text.slice(0, 80) };
    return { s: 'ALIVE' }; // 200 handled OR 400 validation => engine reachable
  } catch (e) {
    clearTimeout(t);
    return { s: 'NETWORK', detail: String(e.message).slice(0, 60) };
  }
}

(async () => {
  const routers = fs.readdirSync(ROOT).filter(f => RX.test(f)).sort();
  const jobs = [];
  const skipped = [];
  for (const rf of routers) {
    const base = '/' + rf.replace(/_router\.js$/, '');
    const ef = rf.replace('_router.js', '_engine.js');
    const fns = allFuncs(rf, ef);
    if (!fns.length) { skipped.push(base); continue; }
    jobs.push({ base, fns });
  }

  const results = [];
  let idx = 0;
  async function worker() {
    while (idx < jobs.length) {
      const j = jobs[idx++];
      let r = { s: 'DEAD' };
      for (const fn of j.fns) {           // try candidates until one proves ALIVE
        r = await probe(j.base, fn);
        if (r.s === 'ALIVE') break;
      }
      results.push({ base: j.base, fn: j.fns[0], ...r });
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));

  const alive = results.filter(r => r.s === 'ALIVE');
  const dead = results.filter(r => r.s === 'DEAD');
  const err = results.filter(r => r.s === 'ERROR');
  const net = results.filter(r => r.s === 'NETWORK');

  console.log(`routers=${routers.length} probed=${results.length} skipped_stubs=${skipped.length}`);
  console.log(`ALIVE=${alive.length} DEAD=${dead.length} ERROR=${err.length} NETWORK=${net.length}`);
  if (dead.length) console.log('DEAD LIST:\n' + dead.map(d => '  ' + d.base).join('\n'));
  if (err.length) console.log('ERROR LIST:\n' + err.map(d => `  ${d.base} ${d.detail || ''}`).join('\n'));
  if (net.length) console.log('NET LIST:\n' + net.map(d => `  ${d.base} ${d.detail || ''}`).join('\n'));

  // Deep curated checks (real payloads â†’ ok:true)
  let deepPass = 0, deepTotal = 0;
  const deep = [
    ['/tier313_cpu_1494/t313_e1_heart_score', { history_score: 2, ecg_score: 1, age_score: 2, risk_factor_score: 1, troponin_score: 0 }],
    ['/tier312_oox_1493/t312_e1_lesion_risk_mirels', { site: 'peritrochanteric', pain_score: 3, lesion_size: 'more_two_third', cortical_breach: 'complete' }],
    ['/tier315_hdesk_1496/t315_e3_sla_breach_check', { severity: 'sev1', opened_minutes_ago: 42 }],
    ['/tier317_apm_1498/t317_e1_latency_record', { route: '/x', ms: 2400 }],
    ['/tier318_analytics_1499/t318_e2_funnel_conversion', { counts: [100, 80, 60, 40, 20] }],
  ];
  if (process.argv.includes('--deep')) {
    for (const [u, extra] of deep) {
      deepTotal++;
      try {
        const res = await fetch(`${BASE}${u}`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-tenant-id': 't1', ...(process.env.TIER_API_KEY ? { 'x-api-key': process.env.TIER_API_KEY } : {}) },
          body: JSON.stringify({ tenant_id: 't1', patient_id: 'p1', ...extra }) });
        const j = await res.json().catch(() => ({}));
        if (j.ok === true) { deepPass++; } else console.log('DEEP FAIL', u, JSON.stringify(j).slice(0, 90));
      } catch (e) { console.log('DEEP ERR', u, e.message); }
    }
    console.log(`DEEP: ${deepPass}/${deepTotal}`);
  }

  const ok = dead.length === 0 && err.length === 0 && net.length === 0 && (!process.argv.includes('--deep') || deepPass === deepTotal);
  console.log(ok ? '\nSWEEP GREEN' : '\nSWEEP RED');
  process.exit(ok ? 0 : 1);
})();
