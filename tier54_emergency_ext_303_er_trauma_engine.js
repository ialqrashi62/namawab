// filepath: tier54_emergency_ext_303_er_trauma_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function polytrauma(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.iss, 'iss');
  ensureStr(req.mechanism, 'mech');
  ensureStr(req.airway, 'aw');
  ensureStr(req.breathing, 'bre');
  ensureStr(req.circulation, 'circ');
  ensureStr(req.disability, 'dis');
  ensureStr(req.exposure, 'exp');
  return { iss: req.iss };
}
function burn_thermal(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.tbsa_pct, 'tbsa');
  ensureEnum(req.depth, 'dep', ['superficial_1st','partial_thickness_2nd','deep_partial_2nd','full_thickness_3rd','mixed_2nd_3rd']);
  ensureBool(req.inhalation_injury, 'inh');
  ensureStr(req.fluid_resuscitation, 'fr');
  ensureStr(req.airway, 'aw');
  ensureStr(req.referral, 'ref');
  return { tbsa: req.tbsa_pct };
}
function trauma_amputation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.type, 'typ');
  ensureStr(req.mechanism, 'mech');
  ensureNum(req.ischemia_time_min, 'it');
  ensureStr(req.reimplantation_candidate, 'rc');
  ensureStr(req.surgery, 'su');
  return { ischemia: req.ischemia_time_min };
}
function blast_injury(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.mechanism, 'mech');
  ensureStr(req.injuries, 'inj');
  ensureStr(req.primary_survey, 'ps');
  ensureStr(req.secondary_survey, 'ss');
  ensureBool(req.hearing_loss, 'hl');
  return { mechanism: req.mechanism };
}
function penetrating_trauma(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.site, 'site');
  ensureEnum(req.injury_type, 'it', ['gsw','stab_wound','shrapnel','impalement','mixed']);
  ensureStr(req.hemodynamic, 'hd');
  ensureStr(req.intervention, 'int');
  ensureStr(req.findings, 'find');
  return { site: req.site };
}

function funcs() { return { polytrauma, burn_thermal, trauma_amputation, blast_injury, penetrating_trauma }; }
module.exports = { funcs, ValidationError };