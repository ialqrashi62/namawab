// filepath: tier54_emergency_ext_307_er_gi_gi_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function gi_bleed_upper(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.source, 'src');
  ensureStr(req.volume, 'vol');
  ensureNum(req.initial_hgb, 'hgb');
  ensureStr(req.transfusion, 'tx');
  ensureStr(req.intervention, 'int');
  ensureEnum(req.outcome, 'out', ['hemostasis_achieved','ongoing_bleed','re_bleeding','death']);
  return { hgb: req.initial_hgb };
}
function gi_bleed_lower(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.source, 'src');
  ensureStr(req.volume, 'vol');
  ensureNum(req.initial_hgb, 'hgb');
  ensureStr(req.transfusion, 'tx');
  ensureStr(req.intervention, 'int');
  ensureEnum(req.outcome, 'out', ['hemostasis_achieved','ongoing_bleed','re_bleeding','death']);
  return { hgb: req.initial_hgb };
}
function bowel_obstruction(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.site, 'site', ['small_bowel','large_bowel','colonic','gastric_outlet','sigmoid_volvulus','cecal_volvulus']);
  ensureEnum(req.etiology, 'eti', ['adhesions','hernia','tumor','volvulus','intussusception','inflammatory','foreign_body']);
  ensureStr(req.ct, 'ct');
  ensureStr(req.management, 'mgmt');
  ensureEnum(req.outcome, 'out', ['observation_vs_surgery','surgery_planned','resolved','complicated']);
  return { site: req.site };
}
function perforation_gi(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.site, 'site', ['duodenal','gastric','small_bowel','appendiceal','colonic_right','colonic_left','sigmoid','rectal']);
  ensureStr(req.etiology, 'eti');
  ensureStr(req.free_air, 'fa');
  ensureStr(req.intervention, 'int');
  ensureStr(req.antibiotics, 'abx');
  ensureEnum(req.outcome, 'out', ['stable_postop','unstable','death','ongoing']);
  return { site: req.site };
}
function acute_pancreatitis_severe(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.etiology, 'eti');
  ensureNum(req.apache_ii, 'apache');
  ensureStr(req.ct, 'ct');
  ensureStr(req.fluid_resuscitation, 'fr');
  ensureBool(req.icu_admission, 'icu');
  ensureStr(req.organ_failure, 'of');
  return { apache: req.apache_ii };
}

function funcs() { return { gi_bleed_upper, gi_bleed_lower, bowel_obstruction, perforation_gi, acute_pancreatitis_severe }; }
module.exports = { funcs, ValidationError };