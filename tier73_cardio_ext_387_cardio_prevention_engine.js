// filepath: tier73_cardio_ext_387_cardio_prevention_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function lipid_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.patient_id_field, 'pif');
  ensureNum(req.ldl_current, 'lc');
  ensureNum(req.ldl_goal, 'lg');
  ensureEnum(req.statin_type, 'st', ['atorvastatin','rosuvastatin','simvastatin','pravastatin','lovastatin','fluvastatin','pitavastatin','none','high_intensity','moderate_intensity','low_intensity','ezetimibe','pcsk9_inhibitor','bempedoic_acid','other']);
  ensureNum(req.statin_dose_mg, 'sdm');
  ensureEnum(req.current_intensity, 'ci', ['high','moderate','low','minimal','maximum','high_intensity','moderate_intensity','low_intensity','none','other']);
  ensureBool(req.statin_intolerance, 'si');
  ensureEnum(req.side_effects, 'se', ['none','myalgia','myopathy','rhabdomyolysis','liver_toxicity','gi_upset','headache','cognitive','other','multiple']);
  ensureStr(req.add_on_therapy, 'aot');
  ensureEnum(req.risk_category, 'rc', ['low','moderate','high','very_high','extreme','secondary_prevention','unknown','other']);
  ensureNum(req.next_labs_months, 'nlm');
  return { ldl: req.ldl_current };
}
function hypertension_specialist(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.referral_id, 'rid');
  ensureStr(req.bp_average, 'bpa');
  ensureNum(req.bp_uncontrolled_on_meds, 'buom');
  ensureNum(req.medications_count, 'mc');
  ensureBool(req.secondary_cause_evaluated, 'sce');
  ensureBool(req.renal_artery_stenosis_ruled_out, 'rasro');
  ensureNum(req.aldosterone_renin_ratio, 'arr');
  ensureBool(req.sleep_study_ordered, 'sso');
  ensureStr(req.plan, 'plan');
  ensureStr(req.specialist, 'sp');
  ensureNum(req.follow_up, 'fu');
  return { bp: req.bp_average };
}
function cardiovascular_risk_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.ascvd_score, 'ascvd');
  ensureEnum(req.risk_category, 'rc', ['low','borderline','intermediate','high','very_high','unknown','other']);
  ensureStr(req.risk_factors, 'rf');
  ensureStr(req.lifestyle_factors, 'lf');
  ensureStr(req.biomarkers_reviewed, 'br');
  ensureStr(req.imaging_reviewed, 'ir');
  ensureStr(req.preventive_interventions, 'pi');
  ensureBool(req.shared_decision_making, 'sdm');
  ensureNum(req.next_review_months, 'nrm');
  ensureStr(req.provider, 'pr');
  return { ascvd: req.ascvd_score };
}
function antiplatelet_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.agent, 'ag', ['aspirin','clopidogrel','plavix','ticagrelor','prasugrel','dipyridamole','none','dual_antiplatelet','low_dose_aspirin','buffered_aspirin','ec_aspirin','other']);
  ensureNum(req.dose_mg, 'dm');
  ensureEnum(req.indication, 'ind', ['primary_prevention','secondary_prevention','post_pci','post_cabg','post_stroke','peripheral_artery','atrial_fib','other','carotid_stent','other_indication']);
  ensureEnum(req.bleeding_risk_assessed, 'bra', ['low','moderate','high','very_high','unknown','other']);
  ensureEnum(req.thrombotic_risk, 'tr', ['low','moderate','high','very_high','unknown','other']);
  ensureBool(req.plavix_concomitant, 'pc');
  ensureBool(req.statin_concomitant, 'sc');
  ensureEnum(req.gi_protection, 'gp', ['none','ppi','h2_blocker','antacid','multiple','other','misoprostol']);
  ensureNum(req.duration_months, 'dur');
  ensureEnum(req.plan, 'plan', ['continue','discontinue','dose_adjust','switch','add_ppi','add_another_agent','defer','consult','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { agent: req.agent };
}
function smoking_cessation_cardiac(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.patient_id_field, 'pif');
  ensureEnum(req.smoking_status, 'ss', ['current','former','never','never_smoker','recent_quit','unknown','other']);
  ensureNum(req.pack_years, 'py');
  ensureNum(req.years_since_last_smoked, 'yslm');
  ensureNum(req.previous_quit_attempts, 'pqa');
  ensureEnum(req.method, 'method', ['varenicline','bupropion','nicotine_replacement','combination','behavioral','cold_turkey','gradual','ecig','snus','none','other']);
  ensureNum(req.pharmacotherapy_adherence, 'pa');
  ensureBool(req.counseling_completed, 'cc');
  ensureBool(req.support_call_done, 'scd');
  ensureStr(req.co_intervention, 'ci');
  ensureNum(req.follow_up_months, 'fum');
  ensureNum(req.next_review, 'nr');
  return { status: req.smoking_status };
}

function funcs() { return { lipid_management, hypertension_specialist, cardiovascular_risk_assessment, antiplatelet_management, smoking_cessation_cardiac }; }
module.exports = { funcs, ValidationError };