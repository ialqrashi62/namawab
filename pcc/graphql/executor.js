// pcc/graphql/executor.js
// v3.316.20: Minimal GraphQL executor — pure Node.js (no new npm deps).
// Resolves a small set of top-level fields against the PCC REST catalog.
// Parser is a tiny char-by-char reader — not a real GraphQL parser.
// Never throws; always returns { data, errors? }.
'use strict';

const http = require('http');

const HOST = '127.0.0.1';
const PORT = parseInt(process.env.PCC_PORT || '3100', 10);

// Per-field name map: GraphQL subfield name -> upstream JSON key.
// Only needed where the mapping is not a plain camelCase <-> snake_case flip.
const NAME_MAP = {
  stats: {
    totalModules: 'modules',
    totalFunctions: 'total_functions',
    totalCategories: 'categories',
    avgFunctionsPerModule: 'avg_functions_per_module',
    duplicateFunctionNames: 'duplicate_function_names',
    topCategories: 'top_categories',
  },
  lookup: {
    function: 'fn',
  },
  call: {
    tenantId: 'tenant_id',
    decisionId: 'decisionId',
  },
  record: {
    tenantId: 'tenant_id',
    decisionId: 'decisionId',
  },
};

// Resolver table: each field knows how to fetch its upstream data.
// limit/offset applied client-side because some upstream endpoints ignore them.
const FIELDS = {
  modules: (a) => getJson('/api/v1/pcc-catalog/modules',
    { limit: a.limit, offset: a.offset, category: a.category, search: a.search })
    .then(r => sliceArr(r.modules || [], a.offset || 0, a.limit)),
  module: (a) => getJson('/api/v1/pcc-catalog/module/' + encodeURIComponent(a.slug)),
  search: (a) => getJson('/api/v1/pcc-catalog/search', { q: a.q, limit: a.limit })
    .then(r => sliceArr((r.results || []).map(x => x.slug), 0, a.limit)),
  lookup: (a) => getJson('/api/v1/pcc-catalog/lookup/' + encodeURIComponent(a.fn)),
  stats: () => getJson('/api/v1/pcc-catalog/stats'),
  coverage: () => getJson('/api/v1/pcc-catalog/coverage'),
  audit: (a) => getJson('/api/v1/pcc-catalog/audit', { limit: a.limit, tenant_id: a.tenant_id }),
  call: (a) => postJson('/api/v1/pcc-' + a.module + '/call/' + encodeURIComponent(a.fn),
    Object.assign({}, a.input || {}, { decisionId: a.decisionId, tenant_id: a.tenant_id })),
  record: (a) => postJson('/api/v1/pcc-' + a.module + '/record',
    { fn: a.fn, input: a.input || {}, decisionId: a.decisionId, tenant_id: a.tenant_id }),
};

// --- HTTP helpers (built-in http only) ---
function getJson(path, params) {
  return new Promise((resolve, reject) => {
    const qs = encodeQs(params);
    const req = http.request({
      host: HOST, port: PORT, path: path + qs, method: 'GET',
      headers: { Accept: 'application/json' }
    }, (res) => { readBody(res).then(resolve, reject); });
    req.on('error', reject);
    req.end();
  });
}

function postJson(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({
      host: HOST, port: PORT, path, method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      }
    }, (res) => { readBody(res).then(resolve, reject); });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function readBody(res) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    res.on('data', (c) => chunks.push(c));
    res.on('end', () => {
      const text = Buffer.concat(chunks).toString('utf8');
      try { resolve(text ? JSON.parse(text) : null); }
      catch (e) { reject(new Error('upstream JSON parse failed: ' + e.message)); }
    });
  });
}

function encodeQs(params) {
  if (!params) return '';
  const parts = [];
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    parts.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
  }
  return parts.length ? '?' + parts.join('&') : '';
}

// Client-side slice used to honor limit/offset when upstream ignores them.
function sliceArr(arr, offset, limit) {
  if (typeof offset !== 'number' && typeof limit !== 'number') return arr;
  const start = offset || 0;
  const end = typeof limit === 'number' ? start + limit : undefined;
  return arr.slice(start, end);
}

// --- Tiny GraphQL parser (top-level only) ---
// Returns [{ field, args, subFields: [{name, value}] }].
function parseQuery(src) {
  if (typeof src !== 'string' || !src.trim()) throw new Error('empty query');
  const open = src.indexOf('{');
  const close = src.lastIndexOf('}');
  if (open < 0 || close < open) throw new Error('malformed query: no braces');
  const body = src.slice(open + 1, close);
  const st = { src: body, i: 0 };
  const fields = [];
  while (true) {
    skipWs(st);
    if (st.i >= st.src.length) break;
    const name = readIdent(st);
    if (!name) break;
    const args = readArgs(st);
    const subFields = readSelection(st);
    fields.push({ field: name, args, subFields });
    skipWs(st);
    if (st.src[st.i] === ',') { st.i++; continue; }
  }
  if (!fields.length) throw new Error('no fields in query');
  return fields;
}
function skipWs(st) { while (st.i < st.src.length && /\s/.test(st.src[st.i])) st.i++; }
function readIdent(st) {
  skipWs(st); const s = st.i;
  while (st.i < st.src.length && /[A-Za-z0-9_]/.test(st.src[st.i])) st.i++;
  return st.src.slice(s, st.i);
}
function readArgs(st) {
  skipWs(st);
  if (st.src[st.i] !== '(') return {};
  st.i++;
  const out = {};
  while (true) {
    skipWs(st);
    if (st.src[st.i] === ')') { st.i++; return out; }
    const k = readIdent(st);
    if (!k) throw new Error('expected arg name');
    skipWs(st);
    if (st.src[st.i] !== ':') throw new Error('expected ":" after arg name "' + k + '"');
    st.i++;
    skipWs(st);
    out[k] = readValue(st);
    skipWs(st);
    if (st.src[st.i] === ',') { st.i++; continue; }
    if (st.src[st.i] === ')') { st.i++; return out; }
  }
}
function readValue(st) {
  skipWs(st);
  const c = st.src[st.i];
  if (c === '"' || c === "'") {
    st.i++; const s = st.i;
    while (st.i < st.src.length && st.src[st.i] !== c) {
      if (st.src[st.i] === '\\') st.i++; st.i++;
    }
    const v = st.src.slice(s, st.i); st.i++; return v;
  }
  if (c === '-' || (c >= '0' && c <= '9')) {
    const s = st.i; if (c === '-') st.i++;
    while (st.i < st.src.length && /[0-9.]/.test(st.src[st.i])) st.i++;
    return Number(st.src.slice(s, st.i));
  }
  if (c === '$') {
    const s = st.i; st.i++;
    while (st.i < st.src.length && /[A-Za-z0-9_]/.test(st.src[st.i])) st.i++;
    return st.src.slice(s, st.i);
  }
  const s = st.i;
  while (st.i < st.src.length && /[A-Za-z0-9_]/.test(st.src[st.i])) st.i++;
  const t = st.src.slice(s, st.i);
  if (t === 'true') return true;
  if (t === 'false') return false;
  if (t === 'null') return null;
  return t;
}
function readSelection(st) {
  skipWs(st);
  if (st.src[st.i] !== '{') return [];
  st.i++;
  const out = [];
  while (true) {
    skipWs(st);
    if (st.src[st.i] === '}') { st.i++; return out; }
    if (st.i >= st.src.length) throw new Error('unterminated selection set');
    const name = readIdent(st);
    if (!name) throw new Error('expected subfield name');
    skipWs(st);
    if (st.src[st.i] === ':') {
      st.i++; skipWs(st); out.push({ name, value: readValue(st) });
    } else {
      out.push({ name, value: null });
    }
    skipWs(st);
    if (st.src[st.i] === ',') { st.i++; continue; }
  }
}

// --- Subfield projection (with name mapping) ---
function project(obj, subFields, map) {
  if (!subFields || !subFields.length) return obj;
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) return obj.map(o => project(o, subFields, map));
  if (typeof obj !== 'object') return obj;
  const out = {};
  for (const sf of subFields) {
    const camel = sf.name;
    const snake = camel.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase());
    let v;
    if (map && Object.prototype.hasOwnProperty.call(map, camel)) v = obj[map[camel]];
    else if (Object.prototype.hasOwnProperty.call(obj, camel)) v = obj[camel];
    else if (Object.prototype.hasOwnProperty.call(obj, snake)) v = obj[snake];
    else continue;
    out[camel] = v;
  }
  return out;
}

// --- Public entry point ---
async function executeQuery({ query, variables, operationName } = {}) {
  const result = { data: {} };
  const errors = [];
  let fields;
  try {
    fields = parseQuery(query);
  } catch (e) {
    return { errors: [{ message: e.message }] };
  }
  for (const f of fields) {
    const resolver = FIELDS[f.field];
    if (!resolver) {
      errors.push({ message: 'Unknown field "' + f.field + '"' });
      result.data[f.field] = null;
      continue;
    }
    try {
      // Resolve $variable references in args.
      const args = {};
      for (const [k, v] of Object.entries(f.args)) {
        args[k] = (typeof v === 'string' && v.startsWith('$'))
          ? (variables ? variables[v.slice(1)] : undefined) : v;
      }
      const raw = await resolver(args);
      result.data[f.field] = project(raw, f.subFields, NAME_MAP[f.field]);
    } catch (e) {
      errors.push({ message: 'Field "' + f.field + '" failed: ' + e.message });
      result.data[f.field] = null;
    }
  }
  if (errors.length) result.errors = errors;
  return result;
}

module.exports = { executeQuery };
