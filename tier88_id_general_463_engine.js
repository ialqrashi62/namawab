// filepath: tier88_id_general_463_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function id_clinic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.chief_complaint, 'cc', ['fever','cough','diarrhea','rash','abscess','lymphadenopathy','joint_pain','weight_loss','sore_throat','uti_symptoms','wound','other']);
  ensureEnum(req.location, 'loc', ['general','community_hospital','outpatient_clinic','other']);
  ensureNum(req.duration_days, 'dur');
  ensureNum(req.max_temp_c, 'mt');
  ensureStr(req.associated_symptoms, 'as');
  ensureBool(req.imaging_done, 'id');
  ensureBool(req.cultures_done, 'cd');
  ensureBool(req.empiric_antibiotics, 'ea');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function fever_workup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.workup_id, 'wid');
  ensureNum(req.fever_days, 'fd');
  ensureNum(req.max_temp_c, 'mtc');
  ensureBool(req.measured, 'meas');
  ensureStr(req.symptoms, 'sym');
  ensureBool(req.travel_history, 'th');
  ensureBool(req.exposure_history, 'eh');
  ensureBool(req.cultures_done, 'cd');
  ensureBool(req.imaging_done, 'id');
  ensureStr(req.biomarkers, 'bm');
  ensureEnum(req.dx, 'dx', ['infection','non_infectious','malignancy','autoimmune','still_unknown','other','unknown']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { wid: req.workup_id };
}
function sepsis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.qsofa_score, 'qs');
  ensureNum(req.sirs_score, 'sir');
  ensureNum(req.lactate, 'lac');
  ensureEnum(req.source, 'src', ['pneumonia','uti','abdominal','skin','line','unknown','other']);
  ensureBool(req.organ_dysfunction, 'od');
  ensureBool(req.antibiotics_within_hour, 'awh');
  ensureBool(req.culture_drawn, 'cd');
  ensureNum(req.fluid_resuscitation_ml, 'fr');
  ensureBool(req.vasopressor_started, 'vps');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function tb(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.disease_type, 'dt', ['pulmonary','miliary','extrapulmonary','latent','tb_pleuritis','tb_meningitis','abdominal','lymph','unknown','other']);
  ensureBool(req.sputum_smear_positive, 'ssp');
  ensureBool(req.naat_done, 'naat');
  ensureBool(req.rif_resistance, 'rifr');
  ensureEnum(req.chest_xray_findings, 'cxr', ['normal','cavitary','tree_in_bud','miliary','pleural_effusion','consolidation','other','unknown']);
  ensureEnum(req.treatment_phase, 'tp', ['intensive','continuation','maintenance','completed','unknown','other']);
  ensureEnum(req.tb_drug_type, 'tbdt', ['hrze','hr','preventive_tb','mdr_tb','xdr_tb','other','unknown']);
  ensureBool(req.contact_tracing_done, 'ctd');
  ensureNum(req.follow_up_months, 'fum');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function hiv_visit(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.cd4_count, 'cd4');
  ensureNum(req.viral_load, 'vl');
  ensureEnum(req.art_regimen, 'art', ['biktarvy','triumeq','complera','atripla','dovato','symtuza','genvoya','other','unknown','none']);
  ensureNum(req.adherence_pct, 'ap');
  ensureBool(req.opportunistic_infection, 'oi');
  ensureEnum(req.coinfection_hbv, 'hbv', ['positive','negative','unknown','other']);
  ensureEnum(req.coinfection_hcv, 'hcv', ['positive','negative','cured','unknown','other']);
  ensureBool(req.vaccinations_updated, 'vu');
  ensureBool(req.pap_smear_done, 'psd');
  ensureNum(req.follow_up_months, 'fum');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}

function funcs() { return { id_clinic, fever_workup, sepsis, tb, hiv_visit }; }
module.exports = { funcs, ValidationError };