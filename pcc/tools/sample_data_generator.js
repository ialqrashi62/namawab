#!/usr/bin/env node
/**
 * sample_data_generator.js
 * NamaMedical PCC — CLI sample payload generator for module function calls.
 *
 * Usage:
 *   node sample_data_generator.js [--help] [--list-modules] [--save] [--no-curl]
 *   node sample_data_generator.js <module> [<function>] [--save] [--no-curl]
 *
 * Examples:
 *   node sample_data_generator.js
 *   node sample_data_generator.js pcc_cardiology_ext102
 *   node sample_data_generator.js pcc_cardiology_ext102 CardGenExt --save
 *
 * If <module> is omitted, a random module is selected from the /list catalog.
 * If <function> is omitted, samples are generated for all functions of the module.
 *
 * Data sources (loopback only):
 *   GET http://127.0.0.1:3101/api/v1/pcc-<route>/list
 *
 * No external dependencies. No PHI. No secrets. Self-contained.
 */

'use strict';

const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const PCC_BASE = 'http://127.0.0.1:3101';
const PUBLIC_HOST = 'https://jumanasoft.com';

// ---------------------------------------------------------------------------
// Argument parsing (no external libs)
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const out = { positional: [], flags: { save: false, help: false, listModules: false, noCurl: false } };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') out.flags.help = true;
    else if (a === '--list-modules') out.flags.listModules = true;
    else if (a === '--save') out.flags.save = true;
    else if (a === '--no-curl') out.flags.noCurl = true;
    else if (a.startsWith('--')) {
      // unknown flag: ignore silently
    } else {
      out.positional.push(a);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// HTTP helper (loopback PCC catalog)
// ---------------------------------------------------------------------------

function httpGetJson(urlString, timeoutMs) {
  return new Promise(function (resolve, reject) {
    const u = new URL(urlString);
    const req = http.request(
      {
        hostname: u.hostname,
        port: u.port,
        path: u.pathname + u.search,
        method: 'GET',
        timeout: timeoutMs || 4000,
        headers: { Accept: 'application/json' }
      },
      function (res) {
        const chunks = [];
        res.on('data', function (c) { chunks.push(c); });
        res.on('end', function () {
          const body = Buffer.concat(chunks).toString('utf8');
          if (res.statusCode !== 200) {
            return reject(new Error('HTTP ' + res.statusCode + ' for ' + urlString));
          }
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(new Error('Invalid JSON from ' + urlString + ': ' + e.message));
          }
        });
      }
    );
    req.on('timeout', function () { req.destroy(new Error('timeout')); });
    req.on('error', reject);
    req.end();
  });
}

// ---------------------------------------------------------------------------
// Module discovery
// ---------------------------------------------------------------------------

async function fetchModuleList() {
  // The /list endpoint is per-module. We discover modules from the live catalog
  // by walking a known index endpoint if available; otherwise the caller must
  // pass a module name explicitly.
  // We rely on the /api/v1/pcc-index/catalog aggregate (if present) or fail
  // gracefully. Per-module /list is the canonical source.
  // Try the index first.
  const indexCandidates = [
    PCC_BASE + '/api/v1/pcc-index/catalog',
    PCC_BASE + '/api/v1/pcc-index/list',
    PCC_BASE + '/api/v1/catalog',
    PCC_BASE + '/api/v1/pcc/_catalog'
  ];
  for (const u of indexCandidates) {
    try {
      const data = await httpGetJson(u, 2000);
      if (Array.isArray(data && data.modules)) return data.modules;
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.catalog)) return data.catalog;
    } catch (_) { /* try next */ }
  }
  return null;
}

async function fetchModuleDetail(routeSlug) {
  // routeSlug is e.g. "pcc-cardiology-ext102"
  const url = PCC_BASE + '/api/v1/' + routeSlug + '/list';
  return httpGetJson(url, 4000);
}

function moduleToRouteSlug(moduleName) {
  // pcc_cardiology_ext102 -> pcc-cardiology-ext102
  return String(moduleName).replace(/_/g, '-');
}

function routeSlugToModule(routeSlug) {
  return String(routeSlug).replace(/-/g, '_');
}

// ---------------------------------------------------------------------------
// Sample payload generation (function-name heuristics)
// ---------------------------------------------------------------------------

function randInt(lo, hi) {
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

function randFloat(lo, hi, decimals) {
  const v = Math.random() * (hi - lo) + lo;
  const d = decimals == null ? 2 : decimals;
  return Math.round(v * Math.pow(10, d)) / Math.pow(10, d);
}

function pickOne(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function uuidv4() {
  // RFC 4122 v4 using crypto.randomBytes (no external lib)
  const b = crypto.randomBytes(16);
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = b.toString('hex');
  return (
    h.slice(0, 8) + '-' +
    h.slice(8, 12) + '-' +
    h.slice(12, 16) + '-' +
    h.slice(16, 20) + '-' +
    h.slice(20)
  );
}

function isoNow() {
  return new Date().toISOString();
}

// Heuristic 1: clinical scores (gen / score / scorecard / card / risk)
function genClinicalScore(fnName) {
  return {
    age: randInt(18, 92),
    sex: pickOne(['M', 'F']),
    bp_systolic: randInt(95, 185),
    bp_diastolic: randInt(55, 110),
    heart_rate: randInt(48, 130),
    spo2: randInt(88, 100),
    temperature_c: randFloat(35.4, 39.6, 1),
    respiratory_rate: randInt(10, 28),
    labs: {
      ldl: randInt(70, 220),
      hba1c: randFloat(4.8, 11.2, 1),
      creatinine: randFloat(0.6, 2.4, 1),
      hemoglobin: randFloat(8.5, 17.0, 1),
      potassium: randFloat(3.0, 5.4, 1)
    },
    comorbidities: pickOne([
      [],
      ['hypertension'],
      ['diabetes_t2'],
      ['hypertension', 'diabetes_t2'],
      ['cad', 'ckd_stage_3']
    ])
  };
}

// Heuristic 2: numerical/calculation inputs (calc / measure / index / rate)
function genCalculation(fnName) {
  return {
    value: randFloat(0.0, 250.0, 2),
    unit: pickOne(['mg/dL', 'mmol/L', 'mL/min', 'bpm', 'mmHg', '%', 'g/L']),
    reference_min: randFloat(0.0, 5.0, 2),
    reference_max: randFloat(50.0, 200.0, 2),
    sample_size: randInt(5, 500),
    confidence: randFloat(0.5, 0.99, 3)
  };
}

// Heuristic 3: boolean triggers (flag / check / screen / rule)
function genFlagCheck(fnName) {
  return {
    enabled: true,
    threshold: randFloat(0.1, 1.0, 2),
    dry_run: false,
    rules: [
      { id: 'r1', op: pickOne(['>', '<', '>=', '<=', '==']), value: randInt(1, 100) },
      { id: 'r2', op: '==', value: pickOne(['normal', 'abnormal', 'critical']) }
    ]
  };
}

// Default: object with id, timestamp, patient_id
function genDefault(fnName) {
  return {
    id: uuidv4(),
    timestamp: isoNow(),
    patient_id: uuidv4(),
    function_name: fnName,
    locale: 'en-US',
    source: 'sample_data_generator.js'
  };
}

function generateSampleForFunction(fnName) {
  // Substring match (case-insensitive) — function names like "CardGenExt",
  // "CalcBMI", "FlagSep" embed these tokens mid-word. The original spec uses
  // a token-list heuristic; we use substring containment to match that intent.
  const lc = String(fnName || '').toLowerCase();
  if (/(gen|gens|generate|score|scorecard|card|risk|ascore|bscore)/.test(lc)) {
    return { kind: 'clinical_score', payload: genClinicalScore(fnName), range: '0.0 - 1.0' };
  }
  if (/(calc|measure|index|ratio|rate)/.test(lc)) {
    return { kind: 'calculation', payload: genCalculation(fnName), range: 'numeric (varies)' };
  }
  if (/(flag|check|screen|rule|validate|verify)/.test(lc)) {
    return { kind: 'flag_check', payload: genFlagCheck(fnName), range: 'boolean triggers' };
  }
  return { kind: 'default', payload: genDefault(fnName), range: 'object metadata' };
}

// ---------------------------------------------------------------------------
// Output formatting
// ---------------------------------------------------------------------------

function buildSampleRecord(moduleName, fnName, version) {
  const routeSlug = moduleToRouteSlug(moduleName);
  const generated = generateSampleForFunction(fnName);
  const apiUrl = '/api/v1/' + routeSlug + '/call/' + fnName;
  const record = {
    module: moduleName,
    function: fnName,
    version: version || 'v3.54.54.0',
    sample_payload: generated.payload,
    payload_kind: generated.kind,
    expected_score_range: generated.range,
    api_url: apiUrl,
    curl_example: 'curl -X POST \'' + PUBLIC_HOST + apiUrl + '\' -H \'Content-Type: application/json\' -d \'' + JSON.stringify(generated.payload) + '\''
  };
  return record;
}

function printHelp() {
  const help = [
    'sample_data_generator.js — NamaMedical PCC sample payload generator',
    '',
    'USAGE:',
    '  node sample_data_generator.js [options]',
    '  node sample_data_generator.js <module> [<function>] [options]',
    '',
    'OPTIONS:',
    '  --help           Show this help and exit',
    '  --list-modules   List known modules (queries /api/v1/pcc-index/catalog)',
    '  --save           Save each sample to /tmp/pcc_sample_<module>_<fn>.json',
    '  --no-curl        Omit the curl_example field (smaller output)',
    '',
    'EXAMPLES:',
    '  node sample_data_generator.js --help',
    '  node sample_data_generator.js --list-modules',
    '  node sample_data_generator.js pcc_cardiology_ext102 CardGenExt',
    '  node sample_data_generator.js pcc_cardiology_ext102 --save',
    '  node sample_data_generator.js                   # random module + fn',
    '',
    'NOTES:',
    '  - Heuristic payload kind is decided from the function name:',
    '    clinical_score: gen|generate|score|card|risk ...',
    '    calculation:    calc|measure|index|rate ...',
    '    flag_check:     flag|check|screen|rule ...',
    '    default:        id + timestamp + patient_id (UUID)',
    '  - All samples are SYNTHETIC. No real PHI.',
    '  - Loopback only: hits http://127.0.0.1:3101'
  ].join('\n');
  process.stdout.write(help + '\n');
}

async function listModules() {
  const mods = await fetchModuleList();
  if (!mods || mods.length === 0) {
    process.stdout.write('Could not enumerate modules from index endpoints.\n');
    process.stdout.write('Pass a module name explicitly: node sample_data_generator.js <module>\n');
    return;
  }
  process.stdout.write('Available modules (' + mods.length + '):\n');
  for (const m of mods) {
    const name = typeof m === 'string' ? m : (m.name || m.module || JSON.stringify(m));
    process.stdout.write('  - ' + name + '\n');
  }
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv);
  if (args.flags.help) {
    printHelp();
    return 0;
  }
  if (args.flags.listModules) {
    await listModules();
    return 0;
  }

  let moduleName = args.positional[0] || null;
  let functionName = args.positional[1] || null;

  // If no module given, try to pick a random one
  if (!moduleName) {
    const mods = await fetchModuleList();
    if (mods && mods.length > 0) {
      moduleName = typeof mods[0] === 'string' ? mods[0] : (mods[0].name || mods[0].module);
      if (typeof moduleName !== 'string' || !moduleName) {
        process.stderr.write('Could not derive a module name from catalog.\n');
        return 1;
      }
      // pick a random module rather than always the first
      const choice = pickRandom(mods);
      moduleName = typeof choice === 'string' ? choice : (choice.name || choice.module);
    } else {
      process.stderr.write('No module provided and no index endpoint reachable.\n');
      process.stderr.write('Usage: node sample_data_generator.js <module> [<function>]\n');
      return 1;
    }
  }

  // Fetch /list for this module
  let detail;
  try {
    detail = await fetchModuleDetail(moduleToRouteSlug(moduleName));
  } catch (e) {
    process.stderr.write('Failed to fetch /list for ' + moduleName + ': ' + e.message + '\n');
    return 1;
  }

  if (!detail || !Array.isArray(detail.functions) || detail.functions.length === 0) {
    process.stderr.write('Module ' + moduleName + ' returned no functions.\n');
    return 1;
  }

  const version = detail.version || 'v3.54.54.0';
  const functions = functionName ? [functionName] : detail.functions;

  const records = [];
  for (const fn of functions) {
    const rec = buildSampleRecord(moduleName, fn, version);
    if (args.flags.noCurl) delete rec.curl_example;
    records.push(rec);
  }

  const out = records.length === 1 ? records[0] : { module: moduleName, version: version, samples: records };
  const json = JSON.stringify(out, null, 2);
  process.stdout.write(json + '\n');

  if (args.flags.save) {
    for (const rec of records) {
      const fname = '/tmp/pcc_sample_' + rec.module + '_' + rec.function + '.json';
      try {
        fs.writeFileSync(fname, JSON.stringify(rec, null, 2));
        process.stderr.write('saved: ' + fname + '\n');
      } catch (e) {
        process.stderr.write('save failed for ' + fname + ': ' + e.message + '\n');
      }
    }
  }

  return 0;
}

// Only run main when invoked directly (allows --help and parseArgs unit tests
// without side effects).
if (require.main === module) {
  main().then(
    function (code) { process.exit(code || 0); },
    function (err) {
      process.stderr.write('FATAL: ' + (err && err.message ? err.message : String(err)) + '\n');
      process.exit(1);
    }
  );
}

module.exports = {
  parseArgs: parseArgs,
  generateSampleForFunction: generateSampleForFunction,
  buildSampleRecord: buildSampleRecord,
  moduleToRouteSlug: moduleToRouteSlug,
  routeSlugToModule: routeSlugToModule,
  uuidv4: uuidv4
};
