// filepath: tier67_surg_periop_365_surg_postop_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function pacu_phase1(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureNum(req.aldrete_score, 'as');
  ensureNum(req.pain_score, 'ps');
  ensureBool(req.vitals_stable, 'vs');
  ensureBool(req.post_op_nausea, 'pon');
  ensureBool(req.emergence_agitation, 'ea');
  ensureNum(req.time_in_p1_min, 'tipm');
  ensureBool(req.transfer_to_p2, 'tp2');
  ensureStr(req.documented_by, 'db');
  return { aldrete: req.aldrete_score };
}
function pacu_phase2(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureNum(req.padss_score, 'ps');
  ensureNum(req.ambulation_distance_ft, 'adf');
  ensureBool(req.tolerated_oral, 'to');
  ensureBool(req.urination, 'ur');
  ensureBool(req.pain_controlled, 'pc');
  ensureStr(req.estimated_discharge_time, 'edt');
  ensureBool(req.discharged, 'dc');
  return { padss: req.padss_score };
}
function post_op_orders(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureEnum(req.diet, 'diet', ['npo','clear_liquids','full_liquids','soft_diet','regular','cardiac_diet','diabetic_diet','low_residue','low_fat','tube_feeds','tpn','renal_diet','other']);
  ensureEnum(req.activity, 'act', ['bedrest','bedrest_with_bathroom','up_to_chair','ambulate_3x','ambulate_4x','unrestricted','fall_precautions','sitter_required','restraints','other']);
  ensureStr(req.pain_meds, 'pm');
  ensureStr(req.antiemetic, 'ae');
  ensureStr(req.wound_care, 'wc');
  ensureStr(req.follow_up, 'fu');
  ensureStr(req.ordered_by, 'ob');
  return { diet: req.diet };
}
function discharge_recovery(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureEnum(req.discharge_status, 'ds', ['home','home_with_services','snf','rehab','ltac','hospice','ama','transfer_to_hospital','expired','observation','other']);
  ensureEnum(req.instructions_given, 'ig', ['written_oral','written_only','oral_only','video','combo','mobile_app','patient_portal','not_provided','other']);
  ensureBool(req.responsible_adult, 'ra');
  ensureBool(req.prescriptions_filled, 'pf');
  ensureEnum(req.transportation, 'tr', ['family','ambulance','medical_transport','public','taxi','rideshare','self','wheelchair_van','other']);
  ensureBool(req.follow_up_scheduled, 'fus');
  return { status: req.discharge_status };
}
function post_op_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.case_id, 'cid');
  ensureNum(req.follow_up_day, 'fud');
  ensureEnum(req.wound_healing, 'wh', ['well','minor_concern','dehiscence','infection','hematoma','seroma','other','pending']);
  ensureNum(req.pain_score, 'ps');
  ensureEnum(req.activity_resumed, 'ar', ['none','limited','partial','mostly','full','n_a','unrestricted']);
  ensureEnum(req.complications, 'comp', ['none','wound_infection','bleeding','dvt','pe','pneumonia','uti','bowel_obstruction','other','pending']);
  ensureNum(req.patient_satisfaction, 'psat');
  ensureNum(req.next_follow_up, 'nfu');
  return { healing: req.wound_healing };
}

function funcs() { return { pacu_phase1, pacu_phase2, post_op_orders, discharge_recovery, post_op_followup }; }
module.exports = { funcs, ValidationError };