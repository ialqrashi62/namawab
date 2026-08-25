// filepath: tier51_dermatology_ext_291_derm_pig_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function melasma(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.fitzpatrick, 'fp', ['i','ii','iii','iv','v','vi']);
  ensureEnum(req.type, 'typ', ['epidermal','dermal','epidermal_mixed']);
  ensureStr(req.trigger, 'trig');
  ensureStr(req.therapy, 'tx');
  ensureEnum(req.response, 'resp', ['partial_improvement','complete','stable','worsening']);
  return { type: req.type };
}
function post_inflammatory_hyperpig(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cause, 'cause');
  ensureStr(req.sites, 'sites');
  ensureStr(req.therapy, 'tx');
  ensureNum(req.duration_months, 'dur');
  ensureEnum(req.response, 'resp', ['gradual_fading','complete','stable','worsening']);
  return { cause: req.cause };
}
function alopecia_areata(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['patchy','totalis','universalis','alopecia_barbae','ophiasis','sisaipho']);
  ensureNum(req.extent_pct, 'ext');
  ensureStr(req.severity, 'sev');
  ensureStr(req.therapy, 'tx');
  ensureEnum(req.response, 'resp', ['partial_regrowth','full_regrowth','stable','progression']);
  return { type: req.type, extent: req.extent_pct };
}
function hyperpig_workup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.distribution, 'dist', ['generalized','localized','face','acral','mucosa']);
  ensureEnum(req.onset, 'onset', ['infant','childhood','adolescent','adult','elderly']);
  ensureStr(req.causes_considered, 'cc');
  ensureStr(req.workup, 'wu');
  return { distribution: req.distribution };
}
function hypopig_workup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.distribution, 'dist', ['focal','segmental','generalized','periorificial']);
  ensureEnum(req.onset, 'onset', ['infant','childhood','adolescent','adult','elderly']);
  ensureStr(req.causes_considered, 'cc');
  ensureStr(req.workup, 'wu');
  return { distribution: req.distribution };
}

function funcs() { return { melasma, post_inflammatory_hyperpig, alopecia_areata, hyperpig_workup, hypopig_workup }; }
module.exports = { funcs, ValidationError };