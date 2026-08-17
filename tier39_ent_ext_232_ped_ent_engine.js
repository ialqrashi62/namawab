// filepath: tier39_ent_ext_232_ped_ent_engine.js
// TIER39_ENT-232: Pediatric ENT
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function adeno_tonsillectomy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.age, 'age');
  ensureEnum(req.indication, 'ind', ['recurrent_strep_6_per_year','recurrent_strep_4_per_year','recurrent_strep_3_per_year','obstructive_sleep_apnea','peritonsillar_abscess','chronic_adenoiditis','obstructive_breathing','other']);
  ensureBool(req.snoring, 'snore');
  ensureBool(req.sleep_study_done, 'sleep');
  ensureEnum(req.complications, 'comp', ['none','primary_hemorrhage','secondary_hemorrhage','dehydration','anesthesia_reaction','airway_event','other']);
  ensureEnum(req.planned, 'plan', ['outpatient','inpatient','observation','urgent','other']);
  let status;
  if (req.indication === 'obstructive_sleep_apnea' && req.sleep_study_done === false) status = 'osa_indication_pre_op_sleep_study';
  else if (req.indication === 'recurrent_strep_3_per_year' && req.age < 3) status = 'young_age_conservative_management';
  else if (req.complications === 'primary_hemorrhage') status = 'post_op_hemorrhage_return_or';
  else if (req.planned === 'outpatient' && req.age < 3) status = 'young_age_overnight_observation';
  else status = 'tonsillectomy_review';
  return { status, ind: req.indication };
}

function recurrent_ear_infection(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.age, 'age');
  ensureNumber(req.infections_per_year, 'infections');
  ensureBool(req.antibiotic_prophylaxis, 'proph');
  ensureBool(req.tympanostomy_tubes_planned, 'tubes');
  ensureBool(req.speech_delay, 'speech');
  let status;
  if (req.infections_per_year >= 4 && req.tympanostomy_tubes_planned === false) status = 'recurrent_om_tubes_indicated';
  else if (req.speech_delay && req.tympanostomy_tubes_planned === false) status = 'speech_delay_with_om_tubes_urgent';
  else if (req.age < 2 && req.antibiotic_prophylaxis) status = 'antibiotic_prophylaxis_review';
  else if (req.tympanostomy_tubes_planned) status = 'tubes_planned_appropriate';
  else status = 'recurrent_om_review';
  return { status, age: req.age };
}

function pediatric_airway(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.age, 'age');
  ensureEnum(req.stridor, 'stridor', ['none','inspiratory','expiratory','biphasic','other']);
  ensureEnum(req.laryngoscopy, 'laryngo', ['normal','subglottic_edema','subglottic_stenosis','laryngomalacia','foreign_body','papilloma','hemangioma','croup','other']);
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','critical','unknown','other']);
  ensureEnum(req.treatment, 'rx', ['observation','racemic_epinephrine','steroid','heliox','intubation','tracheostomy','humidified_oxygen','antibiotic','none','other']);
  let status;
  if (req.severity === 'critical' && req.treatment === 'observation') status = 'critical_airway_icu_intubation';
  else if (req.laryngoscopy === 'foreign_body' && req.treatment !== 'intubation') status = 'foreign_body_immediate_rigid_bronchoscopy';
  else if (req.severity === 'severe' && req.treatment === 'observation') status = 'severe_airway_escalate';
  else if (req.laryngoscopy === 'laryngomalacia' && req.severity === 'mild') status = 'laryngomalacia_observation_appropriate';
  else status = 'pediatric_airway_review';
  return { status, sev: req.severity };
}

function hearing_screen(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.age, 'age');
  ensureBool(req.abr_done, 'abr');
  ensureEnum(req.result, 'res', ['normal','mild_loss_unilateral','mild_loss_bilateral','moderate_loss_unilateral','moderate_loss_bilateral','severe_loss_unilateral','severe_loss_bilateral','profound_loss_unilateral','profound_loss_bilateral','pending','failed','other']);
  ensureBool(req.follow_up_6_months, 'fup');
  ensureBool(req.early_intervention_referred, 'ei');
  let status;
  if (req.result === 'normal') status = 'normal_screen_maintain_annual';
  else if (req.result.includes('severe') && !req.early_intervention_referred) status = 'severe_loss_early_intervention_urgent';
  else if (req.result.includes('mild') && req.follow_up_6_months === false) status = 'mild_loss_follow_up_6_month';
  else if (req.abr_done === false && req.result !== 'pending') status = 'abr_required_for_confirm';
  else status = 'hearing_screen_review';
  return { status, res: req.result };
}

function pediatric_sinus(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.age, 'age');
  ensureEnum(req.diagnosis, 'dx', ['chronic_rhinosinusitis','recurrent_acute_sinusitis','acute_sinusitis','adenoiditis','allergic_rhinitis','cystic_fibrosis','primary_ciliary_dyskinesia','other']);
  ensureEnum(req.ct_sino_nasal, 'ct', ['normal','mucosal_thickening','opacification','polyp','air_fluid_level','other']);
  ensureEnum(req.treatment, 'rx', ['irrigation_intranasal_steroid','irrigation_only','antibiotic','adenoidectomy','endoscopic_sinus_surgery','none','other']);
  ensureEnum(req.adenoid_size, 'adn', ['small','moderate','large','unknown','other']);
  let status;
  if (req.age < 4 && req.treatment === 'endoscopic_sinus_surgery') status = 'ess_premature_age_under_4';
  else if (req.adenoid_size === 'large' && req.treatment === 'irrigation_intranasal_steroid') status = 'large_adenoid_adenoidectomy_refer';
  else if (req.diagnosis === 'chronic_rhinosinusitis' && req.treatment === 'antibiotic') status = 'crs_long_term_antibiotic_review';
  else if (req.diagnosis === 'cystic_fibrosis' && req.treatment === 'none') status = 'cf_sinus_culture_specialist_refer';
  else status = 'pediatric_sinus_review';
  return { status, age: req.age };
}

function funcs() { return { adeno_tonsillectomy, recurrent_ear_infection, pediatric_airway, hearing_screen, pediatric_sinus }; }
module.exports = { funcs, ValidationError };