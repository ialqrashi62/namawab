// filepath: tier153_pic_724_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function picu_admit(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age_months, 'am');
  ensureNum(req.weight_kg, 'wk');
  ensureEnum(req.reason, 'rs', ['respiratory_failure','shock_septic','shock_cardiogenic','shock_hypovolemic','post_op_cardiac','post_op_neuro','post_op_general','trauma','status_epilepticus','severe_DKA','severe_asthma','meningitis','encephalitis','cardiac_arrest','other','NA']);
  ensureNum(req.pelod_score, 'ps');
  ensureNum(req.prism_score, 'pr');
  ensureEnum(req.intubation, 'in', ['no','planned','emergent','NA']);
  ensureBool(req.central_line, 'cl');
  ensureBool(req.arterial_line, 'al');
  ensureNum(req.lactate, 'la');
  ensureNum(req.inotrope_score, 'is');
  ensureEnum(req.disposition, 'dp', ['PICU','PICU_to_PCU','PICU_to_ward','PICU_to_OR','transfer','expired','other','NA']);
  ensureStr(req.provider, 'pr');
  return { pa_id: `pcu_${Date.now()}`, patient_id: req.patient_id, reason: req.reason };
}
function picu_vent(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.mode, 'md', ['PC_SIMV','PRVC','VC_AC','HFOV','NIV_BiPAP','NIV_CPAP','HFNC','NAVA','non_invasive','RAM','other','NA']);
  ensureNum(req.pip_cmh2o, 'pp');
  ensureNum(req.peep_cmh2o, 'pe');
  ensureNum(req.rate_per_min, 'ra');
  ensureNum(req.fio2_pct, 'fo');
  ensureNum(req.tidal_ml_kg, 'tv');
  ensureNum(req.peak_inspiratory_ms, 'pi');
  ensureEnum(req.weaning, 'we', ['no','ongoing','extubated','NA','failed_extubation','planned_extubation','other']);
  ensureNum(req.duration_hr, 'du');
  ensureStr(req.provider, 'pr');
  return { pv_id: `pvn_${Date.now()}`, patient_id: req.patient_id, mode: req.mode };
}
function picu_drugs(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.drug, 'dr', ['dopamine','epinephrine','norepinephrine','vasopressin','dobutamine','milrinone','isoproterenol','phenylephrine','amiodarone','lidocaine','vasoactive_continous','NA','other']);
  ensureNum(req.dose_mcg_kg_min, 'ds');
  ensureNum(req.dose_mcg_kg_hr, 'dh');
  ensureNum(req.duration_hr, 'du');
  ensureEnum(req.titration, 'tt', ['up','down','stable','off','NA']);
  ensureNum(req.inotrope_score, 'is');
  ensureNum(req.vasoactive_index, 'vi');
  ensureNum(req.map_mmhg, 'mm');
  ensureNum(req.central_venous_p, 'cv');
  ensureBool(req.mixed_response, 'mr');
  ensureStr(req.provider, 'pr');
  return { pd_id: `pdr_${Date.now()}`, patient_id: req.patient_id, drug: req.drug };
}
function sepsis_peds(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.temp_c, 'tc');
  ensureNum(req.hr, 'hr');
  ensureNum(req.rr, 'rr');
  ensureNum(req.bp, 'bp');
  ensureNum(req.capillary_refill, 'cr');
  ensureNum(req.lactate, 'la');
  ensureEnum(req.septic_shock, 'ss', ['warm','cold','compensated','decompensated','NA','not_present']);
  ensureNum(req.fluid_boluses, 'fb');
  ensureNum(req.antibiotic_hour, 'ah');
  ensureEnum(req.outcome, 'ot', ['survived','expired','NA']);
  ensureStr(req.provider, 'pr');
  return { ss_id: `pss_${Date.now()}`, patient_id: req.patient_id };
}
function picu_outcome(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.los_days, 'ld');
  ensureEnum(req.disposition, 'dp', ['home','ward','step_down','transfer','expired','hospice','NA','other']);
  ensureNum(req.pelod_at_discharge, 'pa');
  ensureNum(req.functional_status, 'fs');
  ensureEnum(req.pops_score, 'pp', ['good','mild_dysfunction','moderate_dysfunction','severe_dysfunction','very_severe','NA']);
  ensureNum(req.pcf_score, 'pc');
  ensureEnum(req.family_meeting, 'fm', ['no','yes','multiple','NA']);
  ensureBool(req.followup_psychology, 'fp');
  ensureEnum(req.death_cause, 'dc', ['none','sepsis','cardiac','neuro','trauma','withdrawal_of_care','withdrawal_of_support','other','NA']);
  ensureStr(req.provider, 'pr');
  return { po_id: `poc_${Date.now()}`, patient_id: req.patient_id, los: req.los_days };
}

function funcs() { return { picu_admit, picu_vent, picu_drugs, sepsis_peds, picu_outcome }; }
module.exports = { funcs, ValidationError };