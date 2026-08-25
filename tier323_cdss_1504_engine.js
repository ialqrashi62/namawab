// tier323_cdss_1504_engine.js — Unified CDSS registry over verified scoring engines
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.trim()) throw new ValidationError(`${f} must be string`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

// Rule registry: rule -> source engine module (loaded lazily by router)
const REGISTRY = {
  heart_score:        { module: 'tier313_cpu_1494_engine.js',  fn: 't313_e1_heart_score',  domain: 'cardiology', citation: 'HEART score — Six & Backus' },
  mirels_lesion:      { module: 'tier312_oox_1493_engine.js',  fn: 't312_e1_lesion_risk_mirels', domain: 'ortho_onc', citation: 'Mirels classification' },
  emu_localization:   { module: 'tier314_emu_1495_engine.js',  fn: 't314_e3_localization_summary', domain: 'neurology', citation: 'EMU lateralizing concordance' },
};

function cdss_catalog() {
  return Object.entries(REGISTRY).map(([rule, r]) => ({ rule, domain: r.domain, endpoint_hint: `/tier323_cdss_1504/evaluate`, citation: r.citation }));
}

function validate_evaluate(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureEnum(req.rule, 'rule', Object.keys(REGISTRY));
  if (!req.params || typeof req.params !== 'object') throw new ValidationError('params object required', 'params');
  return { rule: req.rule, params: req.params };
}

module.exports = { REGISTRY, cdss_catalog, validate_evaluate, ValidationError };
