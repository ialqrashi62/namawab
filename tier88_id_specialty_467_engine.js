// filepath: tier88_id_specialty_467_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function hiv_specialist(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.cd4_count, 'cd4');
  ensureNum(req.viral_load, 'vl');
  ensureEnum(req.art_regimen, 'art', ['tld','biktarvy','triumeq','complera','atripla','prezcobix','other','naive','none','unknown']);
  ensureNum(req.adherence_pct, 'adh');
  ensureBool(req.opportunistic_infection, 'oi');
  ensureEnum(req.coinfection_hbv, 'hbv', ['positive','negative','unknown','other']);
  ensureEnum(req.coinfection_hcv, 'hcv', ['positive','negative','cured','unknown','other']);
  ensureNum(req.prophylaxis_infections, 'pf');
  ensureNum(req.ten_year_cd4_response, 'tdr');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function hepatitis_clinic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.virus_type, 'vt', ['hbsag','hbeag','hbcab','hcv','hcv_rna','hepatitis_a','hepatitis_e','other','unknown']);
  ensureNum(req.al_t, 'alt');
  ensureNum(req.ast, 'ast');
  ensureNum(req.hbv_dna, 'hbvd');
  ensureNum(req.hcv_rna, 'hcvr');
  ensureNum(req.bilirubin, 'bili');
  ensureNum(req.albumin, 'alb');
  ensureNum(req.inr, 'inr');
  ensureNum(req.fibroscan, 'fib');
  ensureEnum(req.treatment_status, 'ts', ['naive','on_treatment','completed','off_treatment','unknown','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function travel_medicine(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureStr(req.destination, 'dest');
  ensureNum(req.duration_days, 'dur');
  ensureEnum(req.travel_purpose, 'tp', ['leisure','business','missionary','medical_volunteer','military','immigration','other']);
  ensureStr(req.vaccinations_updated, 'vac');
  ensureStr(req.malaria_prophylaxis, 'mal');
  ensureNum(req.travelers_diarrhea_rx, 'tdr');
  ensureBool(req.pre_existing_conditions, 'pec');
  ensureBool(req.altitude_preparation, 'alt');
  ensureStr(req.medication_supply, 'meds');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function fever_unknown_origin(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.fever_days, 'dur');
  ensureNum(req.max_temperature, 'mt');
  ensureBool(req.measured, 'meas');
  ensureStr(req.symptoms, 'sym');
  ensureBool(req.travel_history, 'th');
  ensureBool(req.exposure_history, 'eh');
  ensureNum(req.wbc_count, 'wbc');
  ensureNum(req.crp, 'crp');
  ensureBool(req.cultures_done, 'cd');
  ensureBool(req.imaging_done, 'id');
  ensureEnum(req.diagnosis, 'dx', ['infection','non_infectious','malignancy','autoimmune','still_unknown','other','unknown']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function antimicrobial_stewardship(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.antibiotic_type, 'ab', ['broad_spectrum','narrow_spectrum','mrsa_active','pseudomonas_active','combination','other','unknown']);
  ensureNum(req.duration_days, 'dur');
  ensureBool(req.culture_directed, 'cdd');
  ensureBool(req.deescalation, 'dea');
  ensureBool(req.iv_to_oral, 'io');
  ensureBool(req.renal_dose_adjusted, 'rda');
  ensureBool(req.allergy_checked, 'ac');
  ensureEnum(req.clinical_response, 'cr', ['improving','stable','worsening','adverse_event','died','other','unknown']);
  ensureNum(req.crp_change, 'cc');
  ensureNum(req.procalcitonin, 'pct');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}

function funcs() { return { hiv_specialist, hepatitis_clinic, travel_medicine, fever_unknown_origin, antimicrobial_stewardship }; }
module.exports = { funcs, ValidationError };
