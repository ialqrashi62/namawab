// filepath: tier72_er_390_er_medic_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function acute_mi_protocol(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.ecg_st_changes, 'esc');
  ensureNum(req.first_ecg_min, 'fem');
  ensureNum(req.cardiology_consult_delay_min, 'ccdm');
  ensureBool(req.aspirin_given, 'ag');
  ensureBool(req.heparin_given, 'hg');
  ensureBool(req.statin_given, 'sg');
  ensureBool(req.p2y12_inhibitor_given, 'pyi');
  ensureNum(req.door_to_balloon_target, 'dtbt');
  ensureNum(req.door_to_balloon_actual, 'dtba');
  ensureEnum(req.mi_classification, 'mc', ['stemi','nstemi','unstable_angina','stable_angina','demand_ischemia','type_2_mi','type_1_mi','type_3_mi','type_4a','type_4b','type_5','other']);
  ensureEnum(req.outcome, 'out', ['primary_pci_successful','thrombolysis_successful','medical_management','coronary_angiography_only','no_reperfusion','transferred','expired','other']);
  return { mc: req.mi_classification };
}
function stroke_protocol(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.last_known_well_min, 'lkwm');
  ensureEnum(req.stroke_type, 'st', ['ischemic','hemorrhagic','tia','subarachnoid','subdural','epidural','intracerebral','unknown','other']);
  ensureBool(req.imaging_completed, 'ic');
  ensureBool(req.tpa_eligible, 'te');
  ensureBool(req.tpa_administered, 'ta');
  ensureNum(req.tpa_dose_mg, 'tdm');
  ensureBool(req.mechanical_thrombectomy, 'mt');
  ensureBool(req.nicu_consult, 'nc');
  ensureBool(req.protocol_adherent, 'pa');
  ensureEnum(req.complications, 'comp', ['none','hemorrhagic_conversion','angioedema','anaphylaxis','hypotension','symptomatic_ich','other']);
  ensureEnum(req.discharge_destination, 'dd', ['stroke_unit','nicu','micu','step_down','med_surg','rehab','home','snf','other','expired']);
  return { st: req.stroke_type };
}
function sepsis_protocol(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.sirs_criteria, 'sc');
  ensureNum(req.qsofa_score, 'qs');
  ensureNum(req.lactate_initial, 'li');
  ensureBool(req.blood_cultures_drawn, 'bcd');
  ensureBool(req.antibiotics_within_60min, 'aw60');
  ensureNum(req.fluid_bolus_ml, 'fbm');
  ensureBool(req.fluid_resuscitation_complete, 'frc');
  ensureBool(req.vasopressor_needed, 'vn');
  ensureEnum(req.sepsis_severity, 'ss', ['sepsis','severe_sepsis','septic_shock','sirs','sepsis_like','sepsis_with_organ_dysfunction','other']);
  ensureBool(req.icu_consulted, 'ic');
  ensureBool(req.improvement_within_3h, 'iw3');
  return { ss: req.sepsis_severity };
}
function anaphylaxis_protocol(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.trigger, 'trig');
  ensureEnum(req.reaction_severity, 'rs', ['mild','moderate','severe','fatal','near_fatal','unknown','other']);
  ensureStr(req.im_route, 'imr');
  ensureBool(req.salbutamol, 'sal');
  ensureBool(req.iv_fluids, 'ivf');
  ensureBool(req.steroid_given, 'sg');
  ensureBool(req.h1_blocker_given, 'h1');
  ensureBool(req.h2_blocker_given, 'h2');
  ensureNum(req.observation_period_hours, 'oph');
  ensureBool(req.biphasic_reaction, 'br');
  ensureBool(req.discharge_ready, 'dcr');
  ensureBool(req.epi_autoinjector_prescribed, 'eap');
  return { trig: req.trigger };
}
function toxidrome_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.substance_exposure, 'se', ['acetaminophen','salicylate','opioid','benzodiazepine','stimulant','cocaine','methamphetamine','digoxin','beta_blocker','calcium_channel_blocker','tricyclic_antidepressant','ssri','snri','alcohol','ethylene_glycol','methanol','organophosphate','carbon_monoxide','cyanide','botulism','other']);
  ensureNum(req.time_of_ingestion_min, 'toi');
  ensureNum(req.acetaminophen_level, 'al');
  ensureEnum(req.liver_function, 'lf', ['normal','mildly_abnormal','severely_abnormal','acute_liver_failure','not_done','other']);
  ensureEnum(req.coagulation, 'coag', ['normal','abnormal','inr_above_2','inr_above_4','not_done','other']);
  ensureBool(req.activated_charcoal, 'ac');
  ensureBool(req.n_acetylcysteine_given, 'nacg');
  ensureEnum(req.rumack_matthews_nomogram, 'rmn', ['below_treatment_line','above_treatment_line','low_risk','high_risk','unknown','not_applicable','other']);
  ensureBool(req.psych_consult, 'pc');
  ensureBool(req.cleared_medically, 'cm');
  return { se: req.substance_exposure };
}

function funcs() { return { acute_mi_protocol, stroke_protocol, sepsis_protocol, anaphylaxis_protocol, toxidrome_assessment }; }
module.exports = { funcs, ValidationError };