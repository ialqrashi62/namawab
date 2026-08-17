// filepath: tier55_triage_ext_310_triage_screen_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function suicide_risk_screen(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.phq2_score, 'phq2');
  ensureNum(req.phq9_score, 'phq9');
  ensureNum(req.sad_persons_score, 'sad');
  ensureBool(req.si_present, 'si');
  ensureBool(req.plan_present, 'plan');
  ensureBool(req.means_restricted, 'means');
  ensureStr(req.referral, 'ref');
  return { phq9: req.phq9_score };
}
function substance_use_screen(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.cage_score, 'cage');
  ensureNum(req.audit_c, 'audit');
  ensureNum(req.dast_score, 'dast');
  ensureStr(req.substance, 'sub');
  ensureBool(req.brief_intervention_offered, 'bi');
  ensureStr(req.referral, 'ref');
  return { cage: req.cage_score };
}
function domestic_violence_screen(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureBool(req.husband_abuse_history, 'hah');
  ensureBool(req.physical_violence, 'pv');
  ensureBool(req.sexual_violence, 'sv');
  ensureBool(req.safely_at_home, 'sah');
  ensureEnum(req.safety_plan, 'sp', ['developed','pending','declined','not_applicable']);
  ensureEnum(req.shelter_referral, 'sr', ['provided','declined','pending','not_applicable']);
  return { safely_at_home: req.safely_at_home };
}
function trauma_screen(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.ace_score, 'ace');
  ensureBool(req.ptsd_screen_positive, 'ptsd');
  ensureNum(req.ptssd_brief_score, 'pb');
  ensureStr(req.referral, 'ref');
  ensureBool(req.follow_up_planned, 'fup');
  return { ace: req.ace_score };
}
function psychiatric_screen(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.mini_score, 'mini');
  ensureStr(req.psychiatric_history, 'ph');
  ensureEnum(req.medication_adherence, 'ma', ['good','partial','poor','not_applicable']);
  ensureStr(req.current_state, 'cs');
  ensureStr(req.referral, 'ref');
  return { mini: req.mini_score };
}

function funcs() { return { suicide_risk_screen, substance_use_screen, domestic_violence_screen, trauma_screen, psychiatric_screen }; }
module.exports = { funcs, ValidationError };