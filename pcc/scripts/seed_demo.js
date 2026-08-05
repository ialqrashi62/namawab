#!/usr/bin/env node
// seed_demo.js — populate PCC Sandbox with realistic demo data
// USAGE: node scripts/seed_demo.js [BASE_URL]
// DEFAULT: http://localhost:3100

'use strict';
const http = require('http');

const BASE = process.argv[2] || 'http://localhost:3100';
const HOST = new URL(BASE).hostname;
const PORT = parseInt(new URL(BASE).port || '3100', 10);

function req(method, path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const opts = {
      method, host: HOST, port: PORT, path,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...headers,
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    };
    const r = http.request(opts, (res) => {
      let chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString('utf8');
        try { resolve({ status: res.statusCode, body: text ? JSON.parse(text) : null }); }
        catch (e) { resolve({ status: res.statusCode, body: text }); }
      });
    });
    r.on('error', reject);
    if (data) r.write(data);
    r.end();
  });
}

async function seed() {
  console.log(`PCC demo seed → ${BASE}`);
  console.log('============================================');

  // 1. Issue 10 tokens
  console.log('\n[1] Issuing 10 API tokens');
  const labels = ['ci-runner', 'grafana-scraper', 'mobile-app', 'web-dashboard', 'data-pipeline', 'backup-agent', 'dev-tools', 'load-test', 'analytics', 'monitoring'];
  let issued = 0;
  for (const label of labels) {
    const r = await req('POST', '/api/v1/pcc-catalog/api-token', { label });
    if (r.status === 200 && r.body && r.body.token) {
      console.log(`  ✓ ${label} → ${r.body.token_prefix}`);
      issued++;
    } else {
      console.log(`  ✗ ${label} → ${r.status} (${JSON.stringify(r.body).slice(0, 80)})`);
    }
    await new Promise(r => setTimeout(r, 50));
  }
  console.log(`  ${issued}/10 tokens issued`);

  // 2. Generate 5 audit entries (POST to various modules)
  console.log('\n[2] Generating 5 audit entries');
  const modules = ['pcc-cardiology-ext102', 'pcc-emergency-ext4', 'pcc-oncology-ext7', 'pcc-pediatrics-ext12', 'pcc-radiology-ext3'];
  const fns = ['CardRiskAssessment', 'ESILevelTriage', 'TumorStaging', 'GrowthChartExt', 'ImagingOrder'];
  for (let i = 0; i < 5; i++) {
    const r = await req('POST', `/api/v1/${modules[i]}/record`, {
      tenant_id: 'tnt-demo-001',
      decisionId: 'dec-demo-' + i,
      fn: fns[i],
      input: { demo: true, timestamp: new Date().toISOString() },
    });
    console.log(`  ${r.status === 200 ? '✓' : '✗'} ${modules[i]}/${fns[i]} → ${r.status}`);
    await new Promise(r => setTimeout(r, 100));
  }

  // 3. Generate 3 rate-limit 429 events (burst to /search)
  console.log('\n[3] Triggering 3 rate-limit events');
  for (let i = 0; i < 70; i++) {
    req('GET', '/api/v1/pcc-catalog/search?q=demo&limit=1', null, { 'X-Forwarded-For': '203.0.113.99' })
      .catch(() => {});
  }
  await new Promise(r => setTimeout(r, 1500));
  console.log('  ✓ burst sent (check rate_limit_log if PG enabled)');

  // 4. Snapshot current state
  console.log('\n[4] Current state');
  const tokens = await req('GET', '/api/v1/pcc-catalog/api-token');
  const stats = await req('GET', '/api/v1/pcc-catalog/stats');
  const audit = await req('GET', '/api/v1/pcc-catalog/audit?limit=10');
  console.log(`  Tokens issued: ${tokens.body?.count || 0}`);
  console.log(`  Modules: ${stats.body?.modules || 0}`);
  console.log(`  Audit entries: ${audit.body?.total_entries || audit.body?.entries?.length || 0}`);

  console.log('\n============================================');
  console.log(`Demo seed complete. ${issued} tokens issued.`);
  process.exit(0);
}

seed().catch(e => {
  console.error('Seed failed:', e.message);
  process.exit(1);
});
