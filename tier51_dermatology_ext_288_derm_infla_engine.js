// filepath: tier51_dermatology_ext_288_derm_infla_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function atopic_dermatitis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.age, 'age');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe']);
  ensureNum(req.easi_score, 'easi');
  ensureNum(req.iga_score, 'iga');
  ensureStr(req.trigger, 'trig');
  ensureStr(req.therapy, 'tx');
  return { severity: req.severity, easi: req.easi_score };
}
function psoriasis_severe(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.pas, 'pas');
  ensureNum(req.bsa_pct, 'bsa');
  ensureStr(req.comorbidities, 'comp');
  ensureStr(req.therapy, 'tx');
  ensureEnum(req.response, 'resp', ['improving','stable','worsening','partial']);
  return { pas: req.pas, bsa: req.bsa_pct };
}
function lichen_planus(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['cutaneous','oral','genital','esophageal','nail']);
  ensureStr(req.sites, 'sites');
  ensureStr(req.symptom, 'sx');
  ensureStr(req.therapy, 'tx');
  ensureEnum(req.response, 'resp', ['partial','full','stable','worsening']);
  return { type: req.type };
}
function vitiligo(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['segmental','non_segmental_focal','non_segmental_acrofacial','non_segmental_vulgaris','universal']);
  ensureNum(req.bsa_pct, 'bsa');
  ensureEnum(req.stability, 'stab', ['stable_2_years','stable_1_year','active','mixed']);
  ensureStr(req.therapy, 'tx');
  ensureEnum(req.response, 'resp', ['repigmentation_partial','repigmentation_complete','stable','progression']);
  return { type: req.type, bsa: req.bsa_pct };
}
function hidradenitis_suppurativa(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.hurley_stage, 'hs');
  ensureStr(req.active_sites, 'sites');
  ensureBool(req.refractory_antibiotics, 'ra');
  ensureBool(req.biologic_adalimumab, 'biologic');
  ensureEnum(req.response, 'resp', ['improving','stable','worsening']);
  return { hurley: req.hurley_stage };
}

function funcs() { return { atopic_dermatitis, psoriasis_severe, lichen_planus, vitiligo, hidradenitis_suppurativa }; }
module.exports = { funcs, ValidationError };