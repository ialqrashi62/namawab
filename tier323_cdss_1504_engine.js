// tier323_cdss_1504_engine.js — Unified CDSS registry over verified scoring engines
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.trim()) throw new ValidationError(`${f} must be string`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

// Rule registry: rule -> source engine module (loaded lazily by router)
const REGISTRY = {
  heart_score:        { module: 'tier313_cpu_1494_engine.js',  fn: 't313_e1_heart_score',  domain: 'cardiology', citation: 'HEART score — Six & Backus' },
  grace_proxy:        { module: 'tier313_cpu_1494_engine.js',  fn: 't313_e5_grace_risk_estimate', domain: 'cardiology', citation: 'GRACE (simplified proxy)' },
  mirels_lesion:      { module: 'tier312_oox_1493_engine.js',  fn: 't312_e1_lesion_risk_mirels', domain: 'ortho_onc', citation: 'Mirels classification' },
  emu_localization:   { module: 'tier314_emu_1495_engine.js',  fn: 't314_e3_localization_summary', domain: 'neurology', citation: 'EMU lateralizing concordance' },
  seizure_status:     { module: 'tier314_emu_1495_engine.js',  fn: 't314_e1_seizure_event_log', domain: 'neurology', citation: 'Status epilepticus protocol trigger (>300s)' },
  esi_triage:         { module: 'tier145_ed_689_engine.js',    fn: 'triage', domain: 'emergency', citation: 'ESI 5-level triage' },
  bcma_five_rights:   { module: 'tier325_bcma_1505_engine.js', fn: 't325_e1_five_rights_check', domain: 'medication_safety', citation: 'BCMA five rights' },
  ed_trauma:          { module: 'tier145_ed_689_engine.js',    fn: 'trauma', domain: 'emergency', citation: 'ED trauma activation (ISS/GCS tiers)' },
  ed_toxicology:      { module: 'tier145_ed_689_engine.js',    fn: 'toxicology', domain: 'emergency', citation: 'Toxicology ingestion assessment' },
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
