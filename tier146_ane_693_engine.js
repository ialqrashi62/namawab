// filepath: tier146_ane_693_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function preop(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.asa, 'as');
  ensureEnum(req.airway_mallampati, 'am', ['1','2','3','4','unknown']);
  ensureNum(req.mets, 'me');
  ensureEnum(req.npo_status, 'ns', ['NPO_midnight','clear_liquids_2h','light_meal_6h','heavy_meal_8h','emergency','other']);
  ensureBool(req.allergies_reviewed, 'ar');
  ensureBool(req.consent_obtained, 'co');
  ensureStr(req.provider, 'pr');
  return { pp_id: `pre_${Date.now()}`, patient_id: req.patient_id, asa: req.asa, mallampati: req.airway_mallampati };
}
function induction(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.case_id, 'ci');
  ensureEnum(req.technique, 'tc', ['GETA','LMA','spinal','epidural','regional','MAC','tumescent','topical','local','combined','awake','other']);
  ensureStr(req.airway_device, 'ad');
  ensureEnum(req.induction_agent, 'ia', ['propofol','etomidate','ketamine','sevoflurane','midazolam','thiopental','dex','remifentanil','fentanyl','other']);
  ensureNum(req.induction_dose_mg, 'id');
  ensureNum(req.ett_attempts, 'ea');
  ensureNum(req.duration_min, 'du');
  ensureStr(req.provider, 'pr');
  return { in_id: `ind_${Date.now()}`, patient_id: req.patient_id, technique: req.technique };
}
function intraop(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.case_id, 'ci');
  ensureNum(req.duration_hr, 'dh');
  ensureNum(req.ebl_ml, 'eb');
  ensureNum(req.temperature_c, 'tc');
  ensureNum(req.map_mmhg, 'mm');
  ensureNum(req.urine_output_ml, 'uo');
  ensureEnum(req.airway, 'aw', ['ETT','LMA','mask','spontaneous','native','other']);
  ensureBool(req.surgical_position_change, 'sp');
  ensureStr(req.complications, 'cp');
  ensureStr(req.provider, 'pr');
  return { io_id: `iot_${Date.now()}`, patient_id: req.patient_id, duration_hr: req.duration_hr, airway: req.airway };
}
function pain(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.pain_score, 'ps');
  ensureEnum(req.modality, 'mo', ['PCA_epidural','PCA_IV','peripheral_nerve_cath','epidural','intrathecal','multimodal_PO','multimodal_IV','regional_block','cryo','other']);
  ensureNum(req.morphine_equiv_mg, 'me');
  ensureNum(req.bolus_doses, 'bd');
  ensureNum(req.prn_doses, 'pd');
  ensureBool(req.side_effects, 'se');
  ensureStr(req.provider, 'pr');
  return { pn_id: `pai_${Date.now()}`, patient_id: req.patient_id, modality: req.modality };
}
function emergence(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.case_id, 'ci');
  ensureNum(req.alderete_score, 'as');
  ensureEnum(req.disposition, 'dp', ['PACU_phase1','PACU_phase2','fast_track','ICU','ward','home','SDC','transfer','other']);
  ensureNum(req.pacu_minutes, 'pm');
  ensureBool(req.pain_controlled, 'pc');
  ensureBool(req.nausea, 'na');
  ensureBool(req.shivering, 'sh');
  ensureStr(req.provider, 'pr');
  return { em_id: `emr_${Date.now()}`, patient_id: req.patient_id, aldrete: req.alderete_score, disposition: req.disposition };
}

function funcs() { return { preop, induction, intraop, pain, emergence }; }
module.exports = { funcs, ValidationError };