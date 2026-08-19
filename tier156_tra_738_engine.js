// filepath: tier156_tra_738_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function trauma_eval(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.iss, 'is');
  ensureNum(req.ais_head, 'ah');
  ensureNum(req.ais_face, 'af');
  ensureNum(req.ais_chest, 'ac');
  ensureNum(req.ais_abdomen, 'aa');
  ensureNum(req.ais_extremity, 'ae');
  ensureNum(req.ais_external, 'ax');
  ensureEnum(req.mechanism, 'me', ['MVC','fall','gunshot','stab','burn','crush','blast','pedestrian','sport','work','assault','other','NA']);
  ensureBool(req.airway_secured, 'as');
  ensureBool(req.chest_tube, 'ct');
  ensureBool(req.iv_access, 'iv');
  ensureNum(req.gcs_total, 'gc');
  ensureNum(req.sbp, 'sb');
  ensureNum(req.hr, 'hr');
  ensureBool(req.mtp, 'mp');
  ensureStr(req.provider, 'pr');
  return { te_id: `trv_${Date.now()}`, patient_id: req.patient_id, iss: req.iss };
}
function resus(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.crystalloid_ml, 'cr');
  ensureNum(req.colloid_ml, 'co');
  ensureNum(req.prbc_units, 'pr');
  ensureNum(req.ffp_units, 'ff');
  ensureNum(req.platelet_units, 'pl');
  ensureNum(req.cryo_units, 'cy');
  ensureNum(req.fibrinogen_grams, 'fi');
  ensureNum(req.factor_vii, 'fv');
  ensureNum(req.prothrombin, 'pt');
  ensureBool(req.mtp_activated, 'mt');
  ensureNum(req.mtp_ratio, 'mr');
  ensureNum(req.reboa_used, 'rb');
  ensureNum(req.hr, 'hr');
  ensureNum(req.sbp, 'sb');
  ensureNum(req.lactate, 'la');
  ensureNum(req.base_deficit, 'bd');
  ensureStr(req.provider, 'pr');
  return { rs_id: `rsu_${Date.now()}`, patient_id: req.patient_id };
}
function damage_control(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.operation, 'op', ['laparotomy_packing','thoracotomy','vascular_shunt','hepatic_packing','pelvic_packing','bowel_resection_no_anastomosis','stapler_closure','tourniquet','fasciotomy','ECMO','REBOA','other','NA']);
  ensureNum(req.duration_min, 'du');
  ensureNum(req.ebl_ml, 'eb');
  ensureNum(req.phase1_time, 'pt');
  ensureBool(req.temp_control, 'tc');
  ensureNum(req.coagulopathy_resolved, 'cr');
  ensureNum(req.time_to_icu, 'ti');
  ensureNum(req.packs_count, 'pc');
  ensureNum(req.phase2_time, 'pt2');
  ensureNum(req.time_to_definitive, 'td');
  ensureNum(req.fascial_closure_days, 'fc');
  ensureBool(req.abdominal_compartment, 'ac');
  ensureStr(req.surgeon, 'sg');
  ensureStr(req.provider, 'pr');
  return { dc_id: `dcs_${Date.now()}`, patient_id: req.patient_id, op: req.operation };
}
function complication(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.complication, 'cp', ['none','ARDS','AKI','DIC','MOF','sepsis','wound_infection','dehiscence','evisceration','enterocutaneous_fistula','short_bowel','death','other','NA']);
  ensureEnum(req.severity, 'sv', ['minor','moderate','major','severe','life_threatening','NA']);
  ensureNum(req.days_to_event, 'de');
  ensureNum(req.ventilator_days, 'vd');
  ensureNum(req.icu_days, 'ic');
  ensureNum(req.hospital_days, 'hd');
  ensureNum(req.re_intubations, 'ri');
  ensureNum(req.ventilator_free_days, 'vf');
  ensureNum(req.dialysis_days, 'dd');
  ensureBool(req.tracheostomy, 'tr');
  ensureStr(req.provider, 'pr');
  return { co_id: `cmp_${Date.now()}`, patient_id: req.patient_id, complication: req.complication };
}
function outcome_trauma(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.disposition, 'dp', ['home','rehab','SNF','LTAC','ward','expired','hospice','transfer','NA']);
  ensureNum(req.icu_los, 'ic');
  ensureNum(req.hospital_los, 'ho');
  ensureNum(req.ventilator_days, 've');
  ensureNum(req.fim_score, 'fm');
  ensureNum(req.glasgow_outcome, 'go');
  ensureNum(req.karnofsky, 'ka');
  ensureBool(req.return_to_work, 'rw');
  ensureBool(req.driving_return, 'dr');
  ensureEnum(req.cause_death, 'cd', ['none','hemorrhage','CNS','sepsis','MOF','PE','MI','withdrawal','other','NA']);
  ensureStr(req.provider, 'pr');
  return { ot_id: `otm_${Date.now()}`, patient_id: req.patient_id };
}

function funcs() { return { trauma_eval, resus, damage_control, complication, outcome_trauma }; }
module.exports = { funcs, ValidationError };